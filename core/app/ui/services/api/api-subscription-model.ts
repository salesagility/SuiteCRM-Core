import {HttpErrorResponse} from '@angular/common/http';
import {ApiResponseModel} from './api-response-model';

export interface ApiSubscriptionModel {
    onSuccess: (response: ApiResponseModel) => void;
    onError?: (error: HttpErrorResponse) => void;
}
