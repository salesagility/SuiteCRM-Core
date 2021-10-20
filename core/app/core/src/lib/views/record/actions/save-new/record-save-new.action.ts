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

import {Injectable} from '@angular/core';
import {ViewMode} from 'common';
import {take} from 'rxjs/operators';
import {ModuleNameMapper} from '../../../../services/navigation/module-name-mapper/module-name-mapper.service';
import {RecordActionData, RecordActionHandler} from '../record.action';
import {ActionNameMapper} from '../../../../services/navigation/action-name-mapper/action-name-mapper.service';
import {Router} from '@angular/router';
import {MessageService} from '../../../../services/message/message.service';

@Injectable({
    providedIn: 'root'
})
export class RecordSaveNewAction extends RecordActionHandler {

    key = 'saveNew';
    modes = ['create' as ViewMode];

    constructor(
        protected message: MessageService,
        protected router: Router,
        protected moduleNameMapper: ModuleNameMapper,
        protected actionNameMapper: ActionNameMapper
    ) {
        super();
    }

    run(data: RecordActionData): void {
        data.store.recordStore.validate().pipe(take(1)).subscribe(valid => {
            if (valid) {
                data.store.save().pipe(take(1)).subscribe(
                    record => {
                        const store = data.store;

                        let returnModule = '';

                        if (store.params.return_module) {
                            returnModule = this.moduleNameMapper.toFrontend(store.params.return_module);
                        }

                        let returnAction = '';

                        if (store.params.return_action) {
                            returnAction = this.actionNameMapper.toFrontend(store.params.return_action);
                        }

                        const returnId = store.params.return_id || '';

                        let route = '';
                        if (returnModule) {
                            route += '/' + returnModule;
                        }

                        if (returnAction) {
                            route += '/' + returnAction;
                        }

                        if (returnId) {
                            route += '/' + returnId;
                        }

                        if (returnModule === store.getModuleName() && returnAction === 'record') {
                            route = '/' + store.getModuleName() + '/record/' + record.id;
                        }

                        if (!route && record && record.id) {
                            route = '/' + store.getModuleName() + '/record/' + record.id;
                        }

                        if (!route && record && record.id) {
                            route = '/' + store.getModuleName();
                        }

                        this.router.navigate([route]).then();
                    }
                );
                return;
            }

            this.message.addWarningMessageByKey('LBL_VALIDATION_ERRORS');
        });
    }

    shouldDisplay(data: RecordActionData): boolean {
        return true;
    }
}
