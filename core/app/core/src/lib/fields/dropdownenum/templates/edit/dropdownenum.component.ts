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

import {Option} from 'common';
import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DataTypeFormatter} from '../../../../services/formatters/data-type.formatter.service';
import {LanguageStore} from '../../../../store/language/language.store';
import {FieldLogicManager} from '../../../field-logic/field-logic.manager';
import {FieldLogicDisplayManager} from '../../../field-logic-display/field-logic-display.manager';
import {DropdownEnumDetailFieldComponent} from '../detail/dropdownenum.component';

@Component({
    selector: 'scrm-dropdownenum-edit',
    templateUrl: './dropdownenum.component.html',
    styleUrls: []
})
export class DropdownEnumEditFieldComponent extends DropdownEnumDetailFieldComponent {
    formGroup: FormGroup;

    constructor(
        protected languages: LanguageStore,
        protected typeFormatter: DataTypeFormatter,
        protected logic: FieldLogicManager,
        protected logicDisplay: FieldLogicDisplayManager
    ) {
        super(languages, typeFormatter, logic, logicDisplay);
    }

    ngOnInit(): void {
        super.ngOnInit();

        if (this.record && this.record.formGroup) {
            this.formGroup = this.record.formGroup;
        } else {
            this.formGroup = new FormGroup({});
            this.formGroup.addControl(this.field.name, this.field.formControl);
        }

    }

    public getId(item: Option): string {
        return this.field.name + '-' + item.value;
    }

    protected buildProvidedOptions(options: Option[]): void {
        if (!options.find(option => option.value === '')) {
            options.unshift({ value: '', label: '' });
        }
        super.buildProvidedOptions(options);
    }

}
