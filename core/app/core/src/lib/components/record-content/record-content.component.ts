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

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {FieldMap, Panel, Record} from 'common';
import {map, shareReplay} from 'rxjs/operators';
import {RecordContentConfig, RecordContentDataSource} from './record-content.model';
import {FieldLayoutConfig, FieldLayoutDataSource} from '../field-layout/field-layout.model';
import {LanguageStore} from '../../store/language/language.store';

@Component({
    selector: 'scrm-record-content',
    templateUrl: './record-content.component.html',
    styles: [],
})
export class RecordContentComponent implements OnInit, OnDestroy {

    @Input() dataSource: RecordContentDataSource;

    config: RecordContentConfig = {} as RecordContentConfig;
    panels: Panel[];
    active = 1;
    protected record: Record;
    protected fields: FieldMap;
    private subs: Subscription[] = [];

    constructor(protected language: LanguageStore) {
    }

    ngOnInit(): void {
        this.subs.push(this.dataSource.getDisplayConfig().subscribe(config => {
            this.config = {...config};
        }));
        this.subs.push(this.dataSource.getPanels().subscribe(panels => {
            this.panels = [...panels];
        }));
        this.subs.push(this.dataSource.getRecord().subscribe(record => {
            this.record = {...record};
            this.fields = record.fields;
        }));
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    getLayoutDataSource(panel: Panel): FieldLayoutDataSource {
        return {
            inlineEdit: true,
            getConfig: (): Observable<FieldLayoutConfig> => this.dataSource.getDisplayConfig().pipe(map(config => ({
                mode: config.mode,
                maxColumns: config.maxColumns,
            }))),
            getLayout: (): Observable<Panel> => of(panel).pipe(shareReplay(1)),
            getFields: (): Observable<FieldMap> => this.dataSource.getRecord().pipe(map(record => (record.fields))),
            getRecord: (): Observable<Record> => this.dataSource.getRecord(),
            getEditAction: (): void => this.dataSource.getEditAction()
        } as FieldLayoutDataSource;
    }
}
