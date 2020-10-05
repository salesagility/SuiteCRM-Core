import {Component, Input, OnInit} from '@angular/core';
import {combineLatest, Observable, of} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {LanguageStore, LanguageStrings} from '@store/language/language.store';
import {Record} from '@app-common/record/record.model';
import {Field, FieldManager} from '@app-common/record/field.model';
import {ColumnDefinition} from '@app-common/metadata/list.metadata.model';
import {SortingSelection} from '@app-common/views/list/list-navigation.model';
import {SortDirection, SortDirectionDataSource} from '@components/sort-button/sort-button.model';
import {TableConfig} from '@components/table/table.model';
import {SelectionStatus} from '@components/bulk-action-menu/bulk-action-menu.component';
import {LineAction} from '@app-common/actions/line-action.model';
import {RecordSelection} from '@app-common/views/list/record-selection.model';

interface TableViewModel {
    language: LanguageStrings;
    columns: ColumnDefinition[];
    lineActions: LineAction[];
    selection: RecordSelection;
    selected: { [key: string]: string };
    selectionStatus: SelectionStatus;
    displayedColumns: string[];
    records: Record[] | readonly Record[];
}

@Component({
    selector: 'scrm-table-body',
    templateUrl: 'table-body.component.html',
})
export class TableBodyComponent implements OnInit {
    @Input() config: TableConfig;
    language$: Observable<LanguageStrings> = this.language.vm$;
    maxColumns = 4;
    vm$: Observable<TableViewModel>;

    constructor(protected language: LanguageStore) {
    }

    ngOnInit(): void {
        const lineAction$ = this.config.lineActions$ || of([]).pipe(shareReplay(1));
        const selection$ = this.config.selection$ || of(null).pipe(shareReplay(1));


        this.vm$ = combineLatest([
            this.language$,
            this.config.columns,
            lineAction$,
            selection$,
            this.config.maxColumns$,
            this.config.dataSource.connect(null)
        ]).pipe(
            map((
                [
                    language,
                    columns,
                    lineActions,
                    selection,
                    maxColumns,
                    records
                ]
            ) => {
                const displayedColumns: string[] = [];

                if (selection) {
                    displayedColumns.push('checkbox');
                }

                this.maxColumns = maxColumns;

                const columnsDefs = this.buildDisplayColumns(columns);
                displayedColumns.push(...columnsDefs);

                if (lineActions && lineActions.length) {
                    displayedColumns.push('line-actions');
                }

                const selected = selection && selection.selected || {};
                const selectionStatus = selection && selection.status || SelectionStatus.NONE;

                return {
                    language,
                    columns,
                    lineActions,
                    selection,
                    selected,
                    selectionStatus,
                    displayedColumns,
                    records: records || []
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

    buildDisplayColumns(fields: ColumnDefinition[]): string[] {
        let i = 0;
        let hasLinkField = false;
        const returnArray = [];
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

        return FieldManager.buildField(record, column);
    }
}

