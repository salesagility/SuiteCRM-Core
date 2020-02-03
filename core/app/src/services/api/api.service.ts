import {Injectable} from '@angular/core';
import {KeyValue} from '@angular/common';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {ParamMap, Router} from '@angular/router';
import {Observable} from 'rxjs';
import * as hash from 'object-hash';
import {MessageService} from '../message/message.service';
import {ApiAccessTokenResponseModel} from './api-access-token-response-model';
import {ApiResponseModel} from './api-response-model';
import {ApiSubscriptionModel} from './api-subscription-model';
import {LoginResponseModel} from '../auth/login-response-model';
import {ApiAccessTokenResponseEmpty} from './api-access-token-response-empty';
import {ListViewData, ListViewDataModel} from '../../components/list-view/list-view-data-model';

import {environment} from '@base/environments/environment';

// we can now access environment.apiUrl
const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    protected useCache: boolean = true;

    constructor(
        protected router: Router,
        protected http: HttpClient,
        protected message: MessageService
    ) {

    }

    protected static observables: KeyValue<string, Observable<any>>[] = [];
    protected static subscriptions: KeyValue<string, ApiSubscriptionModel>[] = [];

    protected static accessTokenResponse: ApiAccessTokenResponseModel = new ApiAccessTokenResponseEmpty();

    reset(response?: LoginResponseModel) {
        ApiService.observables = [];
        ApiService.subscriptions = [];
        ApiService.accessTokenResponse = new ApiAccessTokenResponseEmpty();

        if (response) {
            ApiService.accessTokenResponse.accessToken = response.access_token;
            ApiService.accessTokenResponse.expiresIn = response.expires_in;
            ApiService.accessTokenResponse.tokenType = response.token_type;
            ApiService.accessTokenResponse.refreshToken = response.refresh_token;
            ApiService.accessTokenResponse.scope = response.scope ? response.scope : [];
        }
    }

    protected getObservablePending(hashKey: string): Observable<any> | null {
        for (const i in ApiService.observables) {
            if (ApiService.observables[i].key === hashKey) {
                return ApiService.observables[i].value;
            }
        }
        return null;
    }

    protected addObservable(hashKey: string, post: Observable<any>): number {
        if (this.getObservablePending(hashKey)) {
            throw new Error('Post request is already pending');
        }
        return ApiService.observables.push({key: hashKey, value: post});
    }

    protected addSubscribtion(hashKey: string, subscription: ApiSubscriptionModel): number {
        return ApiService.subscriptions.push({key: hashKey, value: subscription});
    }

    protected resolveSubscribtionsOnSuccess(hashKey: string, response: ApiResponseModel): number {
        let resolved = 0;
        ApiService.subscriptions.forEach((subscription: KeyValue<string, ApiSubscriptionModel>) => {
            if (subscription.key === hashKey) {
                subscription.value.onSuccess(response);
                resolved++;
            }
        });
        return resolved;
    }

    protected resolveSubscribtionsOnError(hashKey: string, error: HttpErrorResponse): number {
        let resolved = 0;
        ApiService.subscriptions.forEach((subscription: KeyValue<string, ApiSubscriptionModel>) => {
            if (subscription.key === hashKey) {
                if (subscription.value.onError) {
                    subscription.value.onError(error);
                    resolved++;
                }
            }
        });
        return resolved;
    }

    protected httpRequest(
        params: {
            url: string,
            type?: string,
            body?: any,
            options?: any
        },
        onSuccess: (response: any) => void,
        onError?: (error: HttpErrorResponse) => void): boolean {
        let ok = true;

        if (!params.options) {
            params.options = {};
        }

        params.options.withCredentials = true;
        const hsh = this.useCache ? hash(params, {algorithm: 'md5'}) : hash(Math.random(), {algorithm: 'md5'});
        let req: Observable<any> = this.getObservablePending(hsh);

        if (!req) {

            switch (params.type) {
                case 'POST':
                    req = this.http.post(params.url, params.body, params.options);
                    break;
                case 'GET':
                    req = this.http.get(params.url, params.options);
                    break;
                default:
                    throw new Error('Invalid request type should be "POST" or "GET", ' + params.type + ' given');
            }

            let resolved = 0;

            req.subscribe(
                (response: ApiResponseModel) => {
                    resolved = this.resolveSubscribtionsOnSuccess(hsh, response);
                    if (!resolved) {
                        console.warn('Unhandled HTTP response', {params, response});
                    }
                },
                (error: HttpErrorResponse) => {
                    resolved = this.resolveSubscribtionsOnError(hsh, error);
                    if (!resolved) {
                        console.error('Unhandled HTTP error', {params, error});
                    }
                }
            );

            if (!this.addSubscribtion(hsh, {onSuccess, onError})) {
                console.warn('Unable to subscribe for an HTTP request', params);
                ok = false;
            }

            if (!this.addObservable(hsh, req)) {
                console.warn('Unable to observe an HTTP request', params);
                ok = false;
            }
        } else {
            (response: ApiResponseModel) => {
                let resolved = this.resolveSubscribtionsOnSuccess(hsh, response);
                if (!resolved) {
                    console.warn('Unhandled HTTP response', {params, response});
                }
            }
        }

        return ok;
    }

    protected getAccessToken(
        onSuccess?: (response: ApiAccessTokenResponseModel) => void,
        onError?: (error: HttpErrorResponse) => void
    ): boolean {
        const params = {
            grant_type: 'refresh_token',
            client_id: 'scrmfe',
            client_secret: 'scrmfe',
            scope: ''
        };
        return this.httpRequest(
            {type: 'POST', url: 'index.php?module=Users&controller=Oauth&action=AccessToken', body: params},
            (response: ApiAccessTokenResponseModel) => {
                ApiService.accessTokenResponse = response;
                if (onSuccess) {
                    onSuccess(response);
                }
            },
            (error: HttpErrorResponse) => {
                if (onError) {
                    onError(error);
                } else {
                    console.error('Api auth error', error);
                }
            }
        );
    }

    protected httpRequestAuthorized(
        params: {
            url: string,
            type?: string,
            body?: any,
            options?: any
        },
        onSuccess: (response: ApiResponseModel) => void,
        onError?: (error: HttpErrorResponse) => void,
        onUnauthorized?: (error: HttpErrorResponse) => void
    ): boolean {

        if (!params.options) {
            params.options = {};
        }

        params.options.headers = {Authorization: ApiService.accessTokenResponse.tokenType + ' ' + ApiService.accessTokenResponse.tokenType};
        params.options.withCredentials = true;

        return this.httpRequest(
            params,
            (response: ApiResponseModel) => {
                onSuccess(response);
            },
            (error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // API Request is unauthorized, trying to get a new access_token...
                    this.getAccessToken(() => {
                        if (!onUnauthorized) {
                            this.message.addDangerMessage('API access_token renewed, repeat the request');
                        } else {
                            onUnauthorized(error);
                        }
                    });
                } else {
                    if (!onError) {
                        this.message.addDangerMessage('API response error occured.');
                    } else {
                        onError(error);
                    }
                }
            }
        );
    }

    protected request(
        params: {
            url: string,
            type?: string,
            body?: any,
            options?: any
        },
        onSuccess: (response: ApiResponseModel) => void,
        onError?: (error: HttpErrorResponse) => void,
        onUnauthorized?: (error: HttpErrorResponse) => void
    ): boolean {
        if (!ApiService.accessTokenResponse) {
            this.message.log('API is trying to call an http POST request, but first it needs an access token..');
            return this.getAccessToken((results) => {

                this.message.log('API given an access token results', results);

                if (!this.httpRequestAuthorized(params, onSuccess, onError, onUnauthorized)) {
                    this.message.error('Authorization error', params);
                }
            });
        } else {
            return this.httpRequestAuthorized(params, onSuccess, onError, onUnauthorized);
        }
    }

    protected post(
        url: string, body: any,
        onSuccess: (response: ApiResponseModel) => void,
        onError?: (error: HttpErrorResponse) => void
    ): boolean {
        return this.request({type: 'POST', url, body}, onSuccess, onError);
    }

    protected get(
        url: string,
        onSuccess: (response: ApiResponseModel) => void,
        onError?: (error: HttpErrorResponse) => void
    ): boolean {
        return this.request({type: 'GET', url}, onSuccess, onError);
    }

    getListViewData(
        listViewData: ListViewData,
        callback: (listViewData: ListViewDataModel) => void,
        orderBy: string,
        desc: string
    ) {
        // this.useCache = false;
        // const ret = this.get(this.config.apiBaseUrl + 'module=PluralNames&controller=Index&action=List', (apiResponse: ApiResponseModel) => {
        //   let modulePlural = '';
        //   for (const k in apiResponse) {
        //     if (apiResponse[k].singular === listViewData.module) {
        //       modulePlural = apiResponse[k].plural;
        //       break;
        //     }
        //     if (apiResponse[k].plural === listViewData.module) {
        //       modulePlural = apiResponse[k].plural;
        //       break;
        //     }
        //   }
        //   if (!modulePlural) {
        //     throw new Error('No plural for ' + listViewData.module);
        //   }

        //   return this.get(
        //     this.config.apiBaseUrl + 'moule=' + modulePlural + '&controller=Index&action=List&orderBy=' + orderBy + '&desc=' + desc,
        //   (response: ApiResponseModel) => {

        //     if (response.error) {
        //       throw new Error('Api ressponse error: ' + response.error.message);
        //     }

        //     this.useCache = true;

        //     callback({
        //       module: response.data.module,
        //       columns: response.data.columns,
        //       rows: response.list,
        //       page: response.data.page,
        //       maxpage: response.data.maxpage,
        //     });
        //   });
        // });
        // return ret;

        return false;
    }

    getClassicView(routeParams: ParamMap): Observable<any> {

        let url = API_URL
        let module = routeParams.get('module') || '';
        url += '/classic-views/' + module;

        let params = new HttpParams();
        routeParams.keys.forEach((name) => {
            let value = routeParams.get(name);

            if (name = 'module'){
                return;
            }

            if (value == null || value == undefined) {
                return;
            }

            params = params.set(name, value);
        });

        return this.http.get(url, {
            params: params
        });
    }

}
