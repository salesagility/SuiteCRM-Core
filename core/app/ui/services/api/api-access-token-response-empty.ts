import {ApiAccessTokenResponseModel} from './api-access-token-response-model';

export class ApiAccessTokenResponseEmpty implements ApiAccessTokenResponseModel {
    accessToken = '';
    expiresIn = 0;
    tokenType = '';
    refreshToken = '';
    scope?: string[] = [];
}
