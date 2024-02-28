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

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {transition, trigger, useAnimation} from '@angular/animations';
import {fadeIn} from 'ng-animate';
import {RecoverPasswordService} from '../../../../services/process/processes/recover-password/recover-password';
import {SystemConfigMap, SystemConfigStore} from '../../../../store/system-config/system-config.store';
import {AuthService} from '../../../../services/auth/auth.service';
import {LanguageStore, LanguageStringMap} from '../../../../store/language/language.store';
import {MessageService} from '../../../../services/message/message.service';
import {Process} from '../../../../services/process/process.service';
import {StringMap} from 'common';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AppStateStore} from "../../../../store/app-state/app-state.store";
import {BaseRouteService} from "../../../../services/base-route/base-route.service";


@Component({
    selector: 'scrm-login-ui',
    templateUrl: './mfa.component.html',
    styleUrls: [],
    animations: [
        trigger('fade', [
            transition(':enter', useAnimation(fadeIn, {
                params: {timing: 0.5, delay: 0}
            })),
        ])
    ]
})
export class MfaUiComponent implements OnInit {
    hidden = true;
    loading = false;
    error = '';
    otp = '';

    systemConfigs$: Observable<SystemConfigMap> = this.configs.configs$;
    appStrings$: Observable<LanguageStringMap> = this.languageStore.appStrings$;

    vm$ = combineLatest([this.systemConfigs$, this.appStrings$]).pipe(
        map(([systemConfigs, appStrings]) => {

            return {
                systemConfigs,
                appStrings
            };
        })
    );

    constructor(
        protected router: Router,
        protected auth: AuthService,
        protected message: MessageService,
        protected configs: SystemConfigStore,
        protected languageStore: LanguageStore,
        protected recoverPasswordService: RecoverPasswordService,
        protected appState: AppStateStore,
        protected http: HttpClient,
        protected baseRoute: BaseRouteService,
        protected appStateStore: AppStateStore,
    ) {
        this.loading = false;
        this.hidden = false;
    }

    ngOnInit() {

    }

    doMfa(): void {
        this.loading = true;
        this.auth.doMfa(this.otp, this.onMfaSuccess.bind(this), this.onMfaError.bind(this));
    }

    SendMfa(): Subscription {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        return this.http.post(
            'mfa-send',
            {

            },
            {headers}
        ).subscribe((response: any) => {

            if (this.baseRoute.isNativeAuth()) {
                window.location.href = this.baseRoute.removeNativeAuth();
            }

            this.message.addSuccessMessage(this.languageStore.getFieldLabel('ERR_TWO_FACTOR_CODE_SENT'));

        }, (error: HttpErrorResponse) => {
            this.message.addDangerMessage(this.languageStore.getFieldLabel('ERR_TWO_FACTOR_CODE_FAILED'));
        });
    }

    onMfaSuccess(result: any): void {
        this.loading = false;
        this.message.log('MFA success');
        this.message.removeMessages();

        if (result && result.redirect) {
            this.router.navigate([result.redirect]).then();
            return;
        }

        if (this.appState.getPreLoginUrl()) {
            this.router.navigateByUrl(this.appState.getPreLoginUrl()).then(() => {
                this.appState.setPreLoginUrl('');
            });
            return;
        }

        const defaultModule = this.configs.getHomePage();
        this.router.navigate(['/' + defaultModule]).then();

        return;
    }

    onMfaError(httpError: HttpErrorResponse): void {
        this.loading = false;
        this.message.log('MFA failed');

        const defaultMessage = 'OTP incorrect, please try again.';
        let message = this.languageStore.getFieldLabel('ERR_TWO_FACTOR_FAILED');

        const errorMessage = httpError?.error?.error ?? '';

        if (!message) {
            message = defaultMessage
        }
        this.message.addDangerMessage(message);
    }

    logout(): void{
        this.auth.logout();
    }

}
