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

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TagInputComponent} from 'ngx-chips';
import {DataTypeFormatter} from '../../../../services/formatters/data-type.formatter.service';
import {BaseEnumComponent} from '../../../base/base-enum.component';
import {LanguageStore} from '../../../../store/language/language.store';
import {FieldLogicManager} from '../../../field-logic/field-logic.manager';

@Component({
    selector: 'scrm-boolean-filter',
    templateUrl: './boolean.component.html',
    styleUrls: []
})
export class BooleanFilterFieldComponent extends BaseEnumComponent implements OnInit, OnDestroy {

    @ViewChild('tag') tag: TagInputComponent;

    constructor(protected languages: LanguageStore, protected typeFormatter: DataTypeFormatter, protected logic: FieldLogicManager) {
        super(languages, typeFormatter, logic);
    }

    ngOnInit(): void {
        this.field.value = '';

        if (this.field.criteria.values && this.field.criteria.values.length > 0) {
            this.field.value = this.field.criteria.values[0];
        }

        super.ngOnInit();

    }

    public onAdd(item): void {
        if (item && item.value) {
            this.field.value = item.value;
            this.field.formControl.setValue(item.value);
            this.field.formControl.markAsDirty();
            this.field.criteria.operator = '=';
            this.field.criteria.values = [item.value];
            return;
        }

        this.field.value = '';
        this.field.formControl.setValue('');
        this.field.formControl.markAsDirty();
        this.selectedValues = [];
        this.field.criteria.operator = '';
        this.field.criteria.values = [];

        return;
    }

    public onRemove(): void {
        this.field.value = '';
        this.field.formControl.setValue('');
        this.field.formControl.markAsDirty();
        this.field.criteria.operator = '';
        this.field.criteria.values = [];
        setTimeout(() => {
            this.tag.focus(true, true);
            this.tag.dropdown.show();
        }, 200);
    }

    public getPlaceholderLabel(): string {
        return this.languages.getAppString('LBL_SELECT_ITEM') || '';
    }
}
