/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {transition, trigger, useAnimation} from '@angular/animations';
import {fadeIn} from 'ng-animate';
import {RecoverPasswordService} from '../../../../services/process/processes/recover-password/recover-password';
import {SystemConfigMap, SystemConfigStore} from '../../../../store/system-config/system-config.store';
import {AuthService} from '../../../../services/auth/auth.service';
import {LanguageStore, LanguageStringMap} from '../../../../store/language/language.store';
import {MessageService} from '../../../../services/message/message.service';
import {Process} from '../../../../services/process/process.service';


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
        this.auth.doLogin(this.uname, this.passw, this.onLoginSuccess.bind(this), this.onLoginError.bind(this));
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

    onLoginSuccess(result: any): void {
        this.loading = false;
        this.message.log('Login success');
        this.message.removeMessages();

        if (result && result.redirect) {
            this.router.navigate([result.redirect]).then();
        } else {
            const defaultModule = this.systemConfigStore.getHomePage();
            this.router.navigate(['/' + defaultModule]).then();
        }

        return;
    }

    onLoginError(): void {
        this.loading = false;
        this.message.log('Login failed');
        this.message.addDangerMessage('Login credentials incorrect, please try again.');
    }
}
