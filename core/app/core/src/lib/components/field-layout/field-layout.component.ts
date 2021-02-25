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
import {FieldMap, Panel, Record} from 'common';
import {BreakpointObserver} from '@angular/cdk/layout';
import {FieldGridColumn, FieldGridRow} from '../field-grid/field-grid.model';
import {BaseFieldGridComponent} from '../field-grid/base-field-grid.component';
import {FieldLayoutConfig, FieldLayoutDataSource} from './field-layout.model';

@Component({
    selector: 'scrm-field-layout',
    templateUrl: './field-layout.component.html',
    styles: []
})
export class FieldLayoutComponent extends BaseFieldGridComponent {

    @Input() dataSource: FieldLayoutDataSource;
    config: FieldLayoutConfig;
    layout: Panel;
    fields: FieldMap;
    record: Record;

    baseColClass = {
        col: true,
        'form-group': true,
        'm-1': false,
        'm-0': true,
        'pl-3': true,
        'pb-2': true,
        'pr-3': true
    };

    constructor(protected breakpointObserver: BreakpointObserver) {
        super(breakpointObserver);
    }

    ngOnInit(): void {

        this.subscriptions.push(this.dataSource.getConfig().subscribe(config => {
            this.config = {...config};
        }));
        this.subscriptions.push(this.dataSource.getLayout().subscribe(layout => {
            this.layout = {...layout};
        }));
        this.subscriptions.push(this.dataSource.getFields().subscribe(fields => {
            this.fields = {...fields};
        }));
        this.subscriptions.push(this.dataSource.getRecord().subscribe(record => {
            this.record = {...record};
        }));

        super.ngOnInit();
    }

    buildGrid(): void {
        const grid: FieldGridRow[] = [];

        if (!this.fields || Object.keys(this.fields).length === 0) {
            this.fieldGrid = [];
            return;
        }

        this.layout.rows.forEach(layoutRow => {
            let row = {
                cols: []
            } as FieldGridRow;

            layoutRow.cols.forEach((layoutCol, colIndex) => {
                const fieldName = layoutCol.name;
                const field = this.fields[fieldName] || null;

                if (!field) {
                    row.cols.push({} as FieldGridColumn);
                    return;
                }

                row.cols.push({
                    field
                } as FieldGridColumn);

                if (this.colNumber === 1 && colIndex < layoutRow.cols.length - 1) {
                    grid.push(row);

                    row = {
                        cols: []
                    } as FieldGridRow;
                }
            });

            if (row.cols.length < this.colNumber) {
                this.fillRow(row);
            }


            grid.push(row);
        });

        this.addSpecialSlots(grid);

        this.fieldGrid = grid;
    }

    get colNumber(): number {
        const size = this.sizeMap[this.currentSize];
        if (size === 1) {
            return 1;
        }
        return this.config.maxColumns;
    }
}
