import {ApiResponseErrorModel} from './api-response-error-model';

export interface ApiResponseModel {
    error?: ApiResponseErrorModel;
    meta?: any;
    list?: any[];
    data?: any;
}
