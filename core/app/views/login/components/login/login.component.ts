import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {transition, trigger, useAnimation} from '@angular/animations';
import {fadeIn} from 'ng-animate';
import {AuthService} from '@services/auth/auth.service';
import {MessageService} from '@services/message/message.service';
import {RecoverPasswordService} from '@services/process/processes/recover-password/recover-password';
import {SystemConfigMap, SystemConfigStore} from '@store/system-config/system-config.store';
import {LanguageStore, LanguageStringMap} from '@store/language/language.store';
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
    loading = false;
    error = '';
    uname = '';
    passw = '';
    email = '';

    cardState = 'front';

    systemConfigs$: Observable<SystemConfigMap> = this.systemConfigStore.configs$;
    appStrings$: Observable<LanguageStringMap> = this.languageStore.appStrings$;

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
        protected router: Router,
        protected auth: AuthService,
        protected message: MessageService,
        protected systemConfigStore: SystemConfigStore,
        protected languageStore: LanguageStore,
        protected recoverPasswordService: RecoverPasswordService
    ) {
        this.loading = false;
        this.hidden = false;
    }

    doLanguageChange(language: string): void {
        this.languageStore.changeLanguage(language);
    }

    doGetCurrentLanguage(): string {
        return this.languageStore.getCurrentLanguage();
    }

    flipCard(): void {
        if (this.cardState === 'front') {
            this.cardState = 'back';
        } else {
            this.cardState = 'front';
        }
    }

    doLogin(): void {
        this.loading = true;
        this.auth.doLogin(this, this.uname, this.passw, this.onLoginSuccess.bind(this), this.onLoginError.bind(this));
    }

    recoverPassword(): void {
        this.recoverPasswordService
            .run(this.uname, this.email)
            .subscribe(
                (process: Process) => {
                    this.message.log('Recover Password Status: ' + process.status);

                    let handler = 'addSuccessMessageByKey';
                    if (process.status === 'error') {
                        handler = 'addDangerMessageByKey';
                    }

                    if (process.messages) {
                        process.messages.forEach(message => {
                            this.message[handler](message);
                        });
                    }
                },
                () => {
                    this.message.log('Recover Password failed');
                    this.message.addDangerMessageByKey('ERR_AJAX_LOAD_FAILURE');
                }
            );
    }

    onLoginSuccess(caller: LoginUiComponent): void {
        this.loading = false;
        caller.message.log('Login success');
        caller.message.removeMessages();

        const defaultModule = caller.systemConfigStore.getHomePage();
        caller.router.navigate(['/' + defaultModule]).then();

        return;
    }

    onLoginError(caller: LoginUiComponent): void {
        this.loading = false;
        caller.message.log('Login failed');
        caller.message.addDangerMessage('Login credentials incorrect, please try again.');
    }
}
