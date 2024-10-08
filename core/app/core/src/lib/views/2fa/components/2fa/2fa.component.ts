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

import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "../../../../services/message/message.service";
import {isTrue} from "common";


@Component({
    selector: 'scrm-2fa',
    templateUrl: './2fa.component.html',
    styleUrls: [],
})
export class TwoFactorComponent implements OnInit {

    qrCodeUrl: string;
    qrCodeSvg: string;
    backupCodes: any;
    _auth_code: string;
    isTwoFAEnabled: boolean = false;

    title = 'Two Factor Authentication';

    constructor(protected authService: AuthService, protected router: Router,
                protected message: MessageService) {
    }

    ngOnInit() {
        this.enable2fa();
    }

    public isEnabled(): boolean {
        return this.isTwoFAEnabled;
    }

    public enable2fa() {
        this.authService.enable2fa().subscribe(response => {
            this.qrCodeUrl = response?.url;
            this.qrCodeSvg = response?.svg;
            console.log(response.backupCodes);
            this.backupCodes = response?.backupCodes;
            console.log(this.backupCodes);
        })
    }

    getTitle(): string {
        return this.title;
    }

    public finalize2fa() {
        const _auth_code = this._auth_code;
        this.authService.finalize2fa(_auth_code).subscribe(response => {
            const verified = response?.two_factor_setup_complete ?? false
            if (isTrue(verified)){
                console.log('Two Factor Authentication Successful');
                this.message.addSuccessMessageByKey('LBL_FACTOR_AUTH_SUCCESS');

                const userId = this.authService?.getCurrentUser()?.id;
                const route = `/users/edit/${userId}`;
                this.router.navigate([route]).then();
                return;
            }

            console.log('Two Factor Authentication Failed.');
            this.message.addDangerMessageByKey('LBL_FACTOR_AUTH_FAIL');
        })
    }
}
