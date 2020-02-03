import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {LoginUiComponent} from '../../components/login/login.component';
import {LogoutUiComponent} from '../../components/logout/logout.component';
import {LoginResponseModel} from './login-response-model';
import {MessageService} from '../message/message.service';
import {ApiService} from '../api/api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    protected loginResponse: LoginResponseModel = null;

    protected user = null;

    constructor(
        protected api: ApiService,
        protected router: Router,
        protected message: MessageService,
        protected http: HttpClient
    ) {
    }

    isLoggedIn(): boolean {
        return this.user != null && !this.user.expired;
    }

    doLogin(
        caller: LoginUiComponent,
        username: string,
        password: string,
        onSuccess: (caller: LoginUiComponent, loginResponse: LoginResponseModel) => void,
        onError: (caller: LoginUiComponent, error: HttpErrorResponse) => void
    ) {
        const loginUrl = 'login';

        const body = new HttpParams()
            .set('username', username)
            .set('password', password)
            .set('grant_type', 'password')
            .set('client_id', 'scrmfe')
            .set('client_secret', 'scrmfe');

        return this.http.post(loginUrl,
            body.toString(),
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            }
        ).subscribe((response: LoginResponseModel) => {
            this.api.reset(response);
            this.loginResponse = response;
            onSuccess(caller, this.loginResponse);
        }, (error: HttpErrorResponse) => {
            onError(caller, error);
        });
    }

    getLoginResponse(): LoginResponseModel | null {
        if (!this.loginResponse) {
            return null;
        }
        return this.loginResponse;
    }

    doLogout(
        caller: LogoutUiComponent,
        onSuccess: (caller: LogoutUiComponent, resp: any) => void,
        onError: (caller: LogoutUiComponent, error: HttpErrorResponse) => void
    ) {

        const loginResponse = this.getLoginResponse();

        if (!loginResponse) {
            this.router.navigateByUrl('Login');
            return;
        }

        const logoutUrl = 'logout';

        const body = new HttpParams()
            .set('access_token', loginResponse.access_token)
            .set('refresh_token', loginResponse.refresh_token);

        return this.http.post(logoutUrl,
            body.toString(),
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            }
        ).subscribe((resp) => {
            onSuccess(caller, resp);
        }, (error: HttpErrorResponse) => {
            onError(caller, error);
        });
    }
}
