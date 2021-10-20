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
import {combineLatest, Observable, of} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {
    ColumnDefinition,
    Field,
    Record,
    RecordSelection,
    SelectionStatus,
    SortDirection,
    SortingSelection
} from 'common';
import {FieldManager} from '../../../services/record/field/field.manager';
import {TableConfig} from '../table.model';
import {SortDirectionDataSource} from '../../sort-button/sort-button.model';

interface TableViewModel {
    columns: ColumnDefinition[];
    selection: RecordSelection;
    selected: { [key: string]: string };
    selectionStatus: SelectionStatus;
    displayedColumns: string[];
    records: Record[] | readonly Record[];
    loading: boolean;
}

@Component({
    selector: 'scrm-table-body',
    templateUrl: 'table-body.component.html',
})
export class TableBodyComponent implements OnInit {
    @Input() config: TableConfig;
    maxColumns = 4;
    vm$: Observable<TableViewModel>;

    constructor(
        protected fieldManager: FieldManager
    ) {
    }

    ngOnInit(): void {
        const selection$ = this.config.selection$ || of(null).pipe(shareReplay(1));
        const loading$ = this.config.loading$ || of(false).pipe(shareReplay(1));

        this.vm$ = combineLatest([
            this.config.columns,
            selection$,
            this.config.maxColumns$,
            this.config.dataSource.connect(null),
            loading$
        ]).pipe(
            map((
                [
                    columns,
                    selection,
                    maxColumns,
                    records,
                    loading
                ]
            ) => {
                const displayedColumns: string[] = [];

                if (selection) {
                    displayedColumns.push('checkbox');
                }

                this.maxColumns = maxColumns;

                const columnsDefs = this.buildDisplayColumns(columns);
                displayedColumns.push(...columnsDefs);

                    displayedColumns.push('line-actions');

                const selected = selection && selection.selected || {};
                const selectionStatus = selection && selection.status || SelectionStatus.NONE;

                return {
                    columns,
                    selection,
                    selected,
                    selectionStatus,
                    displayedColumns,
                    records: records || [],
                    loading
                };
            })
        );
    }

    toggleSelection(id: string): void {
        this.config.toggleRecordSelection(id);
    }

    allSelected(status: SelectionStatus): boolean {
        return status === SelectionStatus.ALL;
    }

    buildDisplayColumns(metaFields: ColumnDefinition[]): string[] {
        let i = 0;
        let hasLinkField = false;
        const returnArray = [];

        const fields = metaFields.filter(function (field) {
            return !field.hasOwnProperty('default')
                || (field.hasOwnProperty('default') && field.default === true);
        });

        while (i < this.maxColumns && i < fields.length) {
            returnArray.push(fields[i].name);
            hasLinkField = hasLinkField || fields[i].link;
            i++;
        }
        if (!hasLinkField && (this.maxColumns < fields.length)) {
            for (i = this.maxColumns; i < fields.length; i++) {
                if (fields[i].link) {
                    returnArray.splice(-1, 1);
                    returnArray.push(fields[i].name);
                    break;
                }
            }
        }
        return returnArray;
    }

    getFieldSort(field: ColumnDefinition): SortDirectionDataSource {
        return {
            getSortDirection: (): Observable<SortDirection> => this.config.sort$.pipe(
                map((sort: SortingSelection) => {
                    let direction = SortDirection.NONE;

                    if (sort.orderBy === field.name) {
                        direction = sort.sortOrder;
                    }

                    return direction;
                })
            ),
            changeSortDirection: (direction: SortDirection): void => {
                this.config.updateSorting(field.name, direction);
            }
        } as SortDirectionDataSource;
    }

    getField(column: ColumnDefinition, record: Record): Field {

        if (!column || !record) {
            return null;
        }

        return this.fieldManager.addField(record, column);
    }
}

