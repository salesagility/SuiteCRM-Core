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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseDateTimeComponent} from '@fields/base/datetime/base-datetime.component';
import {NgbDateAdapter, NgbDateParserFormatter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {DatetimeParserFormatter} from '@fields/base/datetime/datetime-parser-formatter.service';
import {DatetimeAdapter} from '@fields/base/datetime/datetime-adapter.service';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {ButtonInterface} from 'common';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-datetime-edit',
    templateUrl: './datetime.component.html',
    styleUrls: [],
    providers: [
        {provide: NgbDateAdapter, useClass: DatetimeAdapter},
        {provide: NgbDateParserFormatter, useClass: DatetimeParserFormatter}
    ]
})
export class DateTimeEditFieldComponent extends BaseDateTimeComponent implements OnInit, OnDestroy {

    date: {
        year: number;
        month: number;
    };

    constructor(
        protected formatter: DatetimeFormatter,
        protected dateAdapter: NgbDateAdapter<string>,
        protected typeFormatter: DataTypeFormatter
    ) {
        super(formatter, typeFormatter);
    }

    ngOnInit(): void {
        this.subscribeValueChanges();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll();
    }


    getOpenButton(datepicker: NgbInputDatepicker): ButtonInterface {
        return {
            klass: 'record-action-button float-right',
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            onClick: () => datepicker.toggle(),
            icon: 'calendar'
        };
    }
}
