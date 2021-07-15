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

import {Component, OnDestroy, OnInit,} from '@angular/core';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {ButtonInterface, isEmptyString} from 'common';
import {PlacementArray} from '@ng-bootstrap/ng-bootstrap/util/positioning';
import {BaseDateTimeComponent} from '../../../base/datetime/base-datetime.component';
import {DataTypeFormatter} from '../../../../services/formatters/data-type.formatter.service';
import {DateParserFormatter} from '../../../base/datetime/date/date-parser-formatter.service';
import {DateFormatter} from '../../../../services/formatters/datetime/date-formatter.service';
import {DateAdapter} from '../../../base/datetime/date/date-adapter.service';
import {FieldLogicManager} from '../../../field-logic/field-logic.manager';


@Component({
    selector: 'scrm-date-filter',
    templateUrl: './date.component.html',
    styleUrls: [],
    providers: [
        {provide: NgbDateAdapter, useClass: DateAdapter},
        {provide: NgbDateParserFormatter, useClass: DateParserFormatter}
    ]
})
export class DateFilterFieldComponent extends BaseDateTimeComponent implements OnInit, OnDestroy {

    public dateModel: NgbDateStruct;

    constructor(
        protected formatter: DateFormatter,
        protected typeFormatter: DataTypeFormatter,
        protected logic: FieldLogicManager
    ) {
        super(formatter, typeFormatter, logic);
    }

    ngOnInit(): void {
        super.ngOnInit();

        let current = '';
        if (this.field.criteria.values && this.field.criteria.values.length > 0) {
            current = this.field.criteria.values[0];
        }

        let formattedValue = null;
        if (!isEmptyString(current)) {
            current = current.trim();
            formattedValue = this.typeFormatter.toUserFormat(this.field.type, current, {mode: 'edit'});
        }
        this.field.value = current;
        this.field.formControl.setValue(formattedValue);
        this.field.formControl.markAsDirty();

        this.setModel(current);

        this.subscribeValueChanges();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll();
    }

    setModel($event: any): void {
        this.dateModel = this.formatter.userDateFormatToStruct($event);
    }

    getOpenButton(datepicker: NgbInputDatepicker): ButtonInterface {
        return {
            klass: 'btn btn-sm btn-outline-secondary m-0 border-0',
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            onClick: () => {
                datepicker.toggle();
                datepicker.navigateTo(this.dateModel);
            },
            icon: 'calendar'
        };
    }

    getPlacement(): PlacementArray {
        return ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
    }

    protected setFieldValue(newValue): void {
        this.field.value = newValue;
        this.field.criteria.operator = '=';
        this.field.criteria.values = [newValue];
    }

}
