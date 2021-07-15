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

import {BaseFieldComponent} from './base-field.component';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {SystemConfigStore} from '../../store/system-config/system-config.store';
import {DataTypeFormatter} from '../../services/formatters/data-type.formatter.service';
import {UserPreferenceStore} from '../../store/user-preference/user-preference.store';
import {FieldLogicManager} from '../field-logic/field-logic.manager';

@Component({template: ''})
export class BaseNumberComponent extends BaseFieldComponent{

    preferences$ = this.userPreferences.userPreferences$;
    configs$ = this.systemConfig.configs$;
    vm$ = combineLatest([this.configs$, this.preferences$]).pipe(
        map(([configs, preferences]) => ({
            configs,
            preferences,
        }))
    );

    constructor(
        protected userPreferences: UserPreferenceStore,
        protected systemConfig: SystemConfigStore,
        protected typeFormatter: DataTypeFormatter,
        protected logic: FieldLogicManager
    ) {
        super(typeFormatter, logic);
    }

    get format(): boolean {
        if (!this.field.metadata) {
            return true;
        }

        return this.field.metadata.format !== false;
    }
}
