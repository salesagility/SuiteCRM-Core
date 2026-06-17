/**
 * SuiteCRM is a customer relationship management program developed by SuiteCRM Ltd.
 * Copyright (C) 2026 SuiteCRM Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUITECRM, SUITECRM DISCLAIMS THE
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

import {Injectable} from '@angular/core';
import {BaseActionManager} from '../../../services/actions/base-action-manager.service';
import {ConfirmationListActionData} from '../models/confirmation-list-modal.model';
import {CancelConfirmationListAction} from './cancel/cancel.action';
import {ProceedConfirmationListAction} from './proceed/proceed.action';
import {AsyncProcessConfirmationListAction} from './async-process/async-process.action';

@Injectable({
    providedIn: 'root',
})
export class ConfirmationListActionManager extends BaseActionManager<ConfirmationListActionData> {

    constructor(
        protected cancel: CancelConfirmationListAction,
        protected proceed: ProceedConfirmationListAction,
        protected async: AsyncProcessConfirmationListAction
    ) {
        super();
        cancel.modes.forEach(mode => this.actions[mode][cancel.key] = cancel);
        proceed.modes.forEach(mode => this.actions[mode][proceed.key] = proceed);
        async.modes.forEach(mode => this.actions[mode][async.key] = async);
    }
}
