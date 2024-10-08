/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2024 SalesAgility Ltd.
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
import {Component, Input} from "@angular/core";
import {AuthService} from "../../../../services/auth/auth.service";
import {NotificationStore} from "../../../../store/notification/notification.store";
import {Router} from "@angular/router";
import {MessageService} from "../../../../services/message/message.service";
import {AppStateStore} from "../../../../store/app-state/app-state.store";
import { isTrue } from "common";

@Component({
    selector: 'scrm-2fa-check',
    templateUrl: './2fa-check.component.html',
    styleUrls: [],
})
export class TwoFactorCheckComponent {

    _auth_code: string;
    @Input() class: string;

    constructor(protected authService: AuthService,
                protected message: MessageService,
                protected appState: AppStateStore,
                protected notificationStore: NotificationStore,
                protected router: Router,
    ) {
    }

    public verifyCode() {
        const _auth_code = this._auth_code;

        this.authService.check2fa(_auth_code).subscribe(response => {

            if (isTrue(response?.login_success) && isTrue(response?.two_factor_complete)) {
                console.log('Two Factor Authentication Successful');
                this.message.addSuccessMessageByKey('LBL_FACTOR_AUTH_SUCCESS');

                this.appState.updateInitialAppLoading(true);
                this.authService.setLanguage(response);
                this.authService.isUserLoggedIn.next(true);
                this.authService.setCurrentUser(response);
                this.notificationStore.enableNotifications();
                this.notificationStore.refreshNotifications();
                return;
            }

            console.log('Two Factor Authentication Failed.');
            this.message.addDangerMessageByKey('LBL_FACTOR_AUTH_FAIL');

        })
    }
}
