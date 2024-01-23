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

import { isEmpty } from 'lodash-es';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TagInputComponent} from 'ngx-chips';
import {DataTypeFormatter} from '../../../../services/formatters/data-type.formatter.service';
import {LanguageStore} from '../../../../store/language/language.store';
import {FieldLogicManager} from '../../../field-logic/field-logic.manager';
import {FieldLogicDisplayManager} from '../../../field-logic-display/field-logic-display.manager';
import { MultiEnumEditFieldComponent } from '../edit/multienum.component';

@Component({
    selector: 'scrm-multienum-filter',
    templateUrl: './multienum.component.html',
    styleUrls: []
})
export class MultiEnumFilterFieldComponent extends MultiEnumEditFieldComponent implements OnInit, OnDestroy {

    @ViewChild('tag') tag: TagInputComponent;

    constructor(
        protected languages: LanguageStore,
        protected typeFormatter: DataTypeFormatter,
        protected logic: FieldLogicManager,
        protected logicDisplay: FieldLogicDisplayManager
    ) {
        super(languages, typeFormatter, logic, logicDisplay);
    }

    ngOnInit(): void {
        this.field.valueList = [];

        if (!isEmpty(this.field.criteria.values)) {
            this.field.valueList = this.field.criteria.values;
        }

        super.ngOnInit();

    }

    protected syncSelectedValuesWithForm(): string[] {
        const selectedValuesValueMap = super.syncSelectedValuesWithForm();

        this.field.criteria.operator = '=';
        this.field.criteria.values = selectedValuesValueMap;

        return selectedValuesValueMap;
    }

}
