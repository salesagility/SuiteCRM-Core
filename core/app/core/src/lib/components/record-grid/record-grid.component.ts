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

import {Component, Input, OnInit} from '@angular/core';
import {Field, Record, ScreenSizeMap, ViewMode} from 'common';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {RecordGridConfig, RecordGridViewModel} from './record-grid.model';

@Component({
    selector: 'scrm-record-grid',
    templateUrl: './record-grid.component.html',
    styleUrls: []
})
export class RecordGridComponent implements OnInit {

    @Input() config: RecordGridConfig;
    gridButtons = [];

    mode: ViewMode = 'detail';
    maxColumns: number = 4;
    sizeMap: ScreenSizeMap = {
        handset: 1,
        tablet: 2,
        web: 3,
        wide: 4
    };
    fields: Field[] = [];
    special: Field[] = [];

    vm$: Observable<RecordGridViewModel>;

    constructor() {
    }

    ngOnInit(): void {
        if (!this.config) {
            return;
        }
        const config = this.config;

        this.vm$ = combineLatest(
            [
                config.record$,
                config.mode$,
                config.fields$,
                config.maxColumns$,
                config.sizeMap$
            ]
        ).pipe(
            map(([record, mode, fields, maxColumns, sizeMap]) => {
                this.mode = mode;
                this.maxColumns = maxColumns;
                this.sizeMap = sizeMap;
                this.fields = this.getFields(record, fields);
                return {record, mode, fields, maxColumns};
            })
        );
    }

    getFields(record: Record, fieldKeys: string[]): Field[] {
        if (!record || !fieldKeys || !record.fields) {
            return [];
        }

        const fields = [];

        fieldKeys.forEach(fieldKey => {
            if (!record.fields[fieldKey]) {
                return;
            }
            fields.push(record.fields[fieldKey]);
        });

        return fields;
    }
}
