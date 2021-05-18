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
import {
    ContentAlign,
    ContentJustify,
    Field,
    isTrue,
    Record,
    ScreenSizeMap,
    StatisticWidgetLayoutRow,
    TextColor,
    TextSizes,
    ViewFieldDefinition,
    ViewMode
} from 'common';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FieldFlexboxCol, RecordFlexboxConfig, RecordFlexboxViewModel} from './record-flexbox.model';
import {LabelDisplay} from '../field-grid/field-grid.model';

@Component({
    selector: 'scrm-record-flexbox',
    templateUrl: './record-flexbox.component.html',
    styles: []
})
export class RecordFlexboxComponent {

    @Input() config: RecordFlexboxConfig;

    mode: ViewMode = 'detail';
    maxColumns: number = 4;
    sizeMap: ScreenSizeMap = {
        handset: 1,
        tablet: 2,
        web: 3,
        wide: 4
    };

    vm$: Observable<RecordFlexboxViewModel>;

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
                config.layout$,
            ]
        ).pipe(
            map(([record, mode, layout]) => {
                this.mode = mode;
                return {record, mode, layout};
            })
        );
    }


    public getRowClass(): { [klass: string]: any } {
        return this.config.rowClass;
    }

    public getColClass(): { [klass: string]: any } {
        return this.config.colClass;
    }

    public getSizeClass(size: TextSizes): string {
        const sizeMap = {
            regular: 'text-regular',
            medium: 'text-medium',
            large: 'text-large',
            'x-large': 'text-x-large',
            'xx-large': 'text-xx-large',
            huge: 'text-huge'
        };

        return sizeMap[size] || 'text-regular';
    }

    public getFontWeight(bold: string | boolean): string {
        let fontWeight = 'font-weight-normal';

        if (bold && isTrue(bold)) {
            fontWeight = 'font-weight-bolder';
        }

        return fontWeight;
    }

    public getColor(color: TextColor): string {
        const sizeMap = {
            yellow: 'text-yellow',
            blue: 'text-blue',
            green: 'text-green',
            red: 'text-red',
            purple: 'text-purple',
            dark: 'text-dark',
            grey: 'text-grey'
        };

        return sizeMap[color] || '';
    }

    public getJustify(justify: ContentJustify): string {
        const justifyMap = {
            start: 'justify-content-start',
            end: 'justify-content-end',
            center: 'justify-content-center',
            between: 'justify-content-between',
            around: 'justify-content-around'
        };

        return justifyMap[justify] || '';
    }

    public getAlign(align: ContentAlign): string {
        const alignMap = {
            start: 'align-items-start',
            end: 'align-items-end',
            center: 'align-items-center',
            baseline: 'align-items-baseline',
            stretch: 'align-items-stretch'
        };

        return alignMap[align] || '';
    }

    public getLayoutRowClass(row: StatisticWidgetLayoutRow): string {
        return (row && row.class) || '';
    }

    public getClass(layoutCol: FieldFlexboxCol): string {

        if (!layoutCol) {
            return '';
        }

        const klasses = [];
        klasses.push(layoutCol.class || '');
        layoutCol.size && klasses.push(this.getSizeClass(layoutCol.size) || '');
        layoutCol.bold && klasses.push(this.getFontWeight(layoutCol.bold) || '');
        layoutCol.color && klasses.push(this.getColor(layoutCol.color) || '');

        return klasses.join(' ');
    }

    getLabelDisplay(col: FieldFlexboxCol): LabelDisplay {
        return col.labelDisplay || (this.config && this.config.labelDisplay) || 'inline';
    }

    getField(record: Record, field: ViewFieldDefinition): Field {
        if (!field || !field.name || !record || !record.fields) {
            return null;
        }

        return record.fields[field.name] || null;
    }

    getFieldClass(col: FieldFlexboxCol): { [key: string]: any } {
        let klasses = this.config.inputClass || {} as { [key: string]: any };

        if (col.inputClass) {
            klasses[col.inputClass] = true;
        }

        return klasses;
    }

    getLabelClass(col: FieldFlexboxCol): { [key: string]: any } {
        let klasses = this.config.labelClass || {} as { [key: string]: any };

        if (col.labelClass) {
            klasses[col.labelClass] = true
        }

        return klasses;
    }

    shouldDisplay(col: FieldFlexboxCol, field: Field) {
        if (!col.hideIfEmpty) {
            return true;
        }

        let hasValue = false;
        hasValue = hasValue || !!field.value;
        hasValue = hasValue || !!(field.valueList && field.valueList.length);
        hasValue = hasValue || !!(field.valueObject && Object.keys(field.valueObject).length);

        return hasValue;
    }

    getDisplay(col: FieldFlexboxCol): string {
        return col.display || '';
    }
}
