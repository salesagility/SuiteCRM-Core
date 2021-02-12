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

import {Component, Input} from '@angular/core';
import {FieldComponentInterface} from './field.interface';
import {Field} from '@app-common/record/field.model';
import {Record} from '@app-common/record/record.model';
import {Subscription} from 'rxjs';
import {isVoid} from '@app-common/utils/value-utils';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({template: ''})
export class BaseFieldComponent implements FieldComponentInterface {
    @Input() mode: string;
    @Input() field: Field;
    @Input() record: Record;
    @Input() klass: { [klass: string]: any } = null;
    protected subs: Subscription[] = [];

    constructor(protected typeFormatter: DataTypeFormatter) {
    }

    protected subscribeValueChanges(): void {
        if (this.field && this.field.formControl) {
            this.subs.push(this.field.formControl.valueChanges.subscribe(value => {

                if (!isVoid(value)) {
                    value = value.trim();
                } else {
                    value = '';
                }

                if (this.typeFormatter && this.field.type) {
                    value = this.typeFormatter.toInternalFormat(this.field.type, value);
                }

                this.setFieldValue(value);
            }));
        }
    }

    protected setFieldValue(newValue): void {
        this.field.value = newValue;
    }

    protected unsubscribeAll(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
