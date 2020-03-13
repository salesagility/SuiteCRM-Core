import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth/auth.service';
import {LoginResponseModel} from '../../services/auth/login-response-model';
import {MessageService} from '../../services/message/message.service';
import {ApiService} from '../../services/api/api.service';

import {SystemConfigs, SystemConfigFacade} from '@services/metadata/configs/system-config.facade';

import {combineLatest, Observable} from 'rxjs';
import {LanguageFacade, LanguageState} from "@base/facades/language.facade";
import {map} from "rxjs/operators";

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

    systemConfigs$: Observable<SystemConfigs> = this.systemConfigFacade.vm$;
    appStrings$: Observable<LanguageState> = this.languageFacade.vm$;

    vm$ = combineLatest([this.systemConfigs$, this.appStrings$]).pipe(
        map(([systemConfigs, appStrings]) => ({systemConfigs, appStrings}))
    );

    /**
     *
     * @param api
     * @param router Router
     * @param auth AuthService
     * @param message MessageService
     * @param systemConfigFacade
     * @param languageFacade
     */
    constructor(
        protected api: ApiService,
        protected router: Router,
        protected auth: AuthService,
        protected message: MessageService,
        protected systemConfigFacade: SystemConfigFacade,
        protected languageFacade: LanguageFacade
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
