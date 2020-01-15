import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth/auth.service';
import {LoginResponseModel} from '../../services/auth/login-response-model';
import {MessageService} from '../../services/message/message.service';
import {ApiService} from '../../services/api/api.service';

@Component({
    selector: 'scrm-login-ui',
    templateUrl: './login.component.html',
    styleUrls: []
})
export class LoginUiComponent {
    hidden = true;
    error = '';
    uname = '';
    passw = '';

    /**
     *
     * @param legacyApi LegacyApiService
     * @param router Router
     * @param auth AuthService
     * @param message MessageService
     */
    constructor(
        protected api: ApiService,
        protected router: Router,
        protected auth: AuthService,
        protected message: MessageService
    ) {
        this.hidden = false;
    }

    doLogin() {
        this.auth.doLogin(this, this.uname, this.passw, this.onLoginSuccess, this.onLoginError);
    }

    onLoginSuccess(caller: LoginUiComponent, loginResponse: LoginResponseModel) {
        caller.message.log('OAuth2 login success');
        caller.router.navigate(['/Home']);
        return;
    }

    onLoginError(caller: LoginUiComponent, errorResponse: any) {
        caller.message.log('OAuth2 login failed');
        caller.message.addDangerMessage('Login credentials incorrect, please try again.');
    }
}
