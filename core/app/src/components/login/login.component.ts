import {Component} from '@angular/core';
import {Router} from '@angular/router';


import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {transition, trigger, useAnimation} from '@angular/animations';
import {fadeIn} from 'ng-animate';

import {AuthService} from '@services/auth/auth.service';
import {MessageService} from '@services/message/message.service';
import {ApiService} from '@services/api/api.service';
import {RecoverPasswordService} from '@services/process/processes/recover-password/recover-password';

import {SystemConfigFacade, SystemConfigMap} from '@base/facades/system-config/system-config.facade';
import {LanguageFacade, LanguageStringMap} from '@base/facades/language/language.facade';
import {Process} from '@services/process/process.service';


@Component({
    selector: 'scrm-login-ui',
    templateUrl: './login.component.html',
    styleUrls: [],
    animations: [
        trigger('fade', [
            transition(':enter', useAnimation(fadeIn, {
                params: {timing: 0.5, delay: 0}
            })),
        ])
    ]
})
export class LoginUiComponent {
    hidden = true;
    error = '';
    uname = '';
    passw = '';
    email = '';

    cardState = 'front';

    systemConfigs$: Observable<SystemConfigMap> = this.systemConfigFacade.configs$;
    appStrings$: Observable<LanguageStringMap> = this.languageFacade.appStrings$;

    vm$ = combineLatest([this.systemConfigs$, this.appStrings$]).pipe(
        map(([systemConfigs, appStrings]) => {
            let showLanguages = false;
            let showForgotPassword = false;

            if (systemConfigs.languages && systemConfigs.languages.items) {
                showLanguages = Object.keys(systemConfigs.languages.items).length > 1;
            }

            if (systemConfigs.passwordsetting && systemConfigs.passwordsetting.items) {
                const forgotPasswordProperty = systemConfigs.passwordsetting.items.forgotpasswordON;
                showForgotPassword = [true, '1', 'true'].includes(forgotPasswordProperty);
            }


            return {
                systemConfigs,
                appStrings,
                showLanguages,
                showForgotPassword
            };
        })
    );

    constructor(
        protected api: ApiService,
        protected router: Router,
        protected auth: AuthService,
        protected message: MessageService,
        protected systemConfigFacade: SystemConfigFacade,
        protected languageFacade: LanguageFacade,
        protected recoverPasswordService: RecoverPasswordService
    ) {
        this.hidden = false;
    }

    flipCard(): void {
        if (this.cardState === 'front') {
            this.cardState = 'back';
        } else {
            this.cardState = 'front';
        }
    }

    doLogin(): void {
        this.auth.doLogin(this, this.uname, this.passw, this.onLoginSuccess.bind(this), this.onLoginError.bind(this));
    }

    recoverPassword(): void {
        this.recoverPasswordService
            .run(this.uname, this.email)
            .subscribe(
                (process: Process) => {
                    this.message.log('Recover Password Status: ' + process.status);

                    let handler = 'addSuccessMessage';
                    if (process.status === 'error') {
                        handler = 'addDangerMessage';
                    }

                    if (process.messages) {
                        process.messages.forEach(message => {
                            const label = this.languageFacade.getAppString(message);
                            this.message[handler](label);
                        });
                    }
                },
                () => {
                    this.message.log('Recover Password failed');
                    this.message.addDangerMessage(this.languageFacade.getAppString('ERR_AJAX_LOAD_FAILURE'));
                }
            );
    }

    onLoginSuccess(caller: LoginUiComponent): void {
        caller.message.log('Login success');
        caller.message.removeMessages();

        const defaultModule = caller.systemConfigFacade.getHomePage();
        caller.router.navigate(['/' + defaultModule]).then();

        return;
    }

    onLoginError(caller: LoginUiComponent): void {
        caller.message.log('Login failed');
        caller.message.addDangerMessage('Login credentials incorrect, please try again.');
    }
}
