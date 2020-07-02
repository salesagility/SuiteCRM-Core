import {Component, Input} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStrings} from '@store/language/language.store';
import {Field, ListViewMeta, MetadataStore} from '@store/metadata/metadata.store.service';
import {map} from 'rxjs/operators';
import {ListViewStore, RecordSelection, SortingSelection} from '@store/list-view/list-view.store';
import {SelectionStatus} from '@components/bulk-action-menu/bulk-action-menu.component';
import {SortDirection, SortDirectionDataSource} from '@components/sort-button/sort-button.model';

@Component({
    selector: 'scrm-table-body',
    templateUrl: 'table-body.component.html',
})
export class TableBodyComponent {
    @Input() module;
    language$: Observable<LanguageStrings> = this.language.vm$;
    listMetadata$: Observable<ListViewMeta> = this.metadata.listMetadata$;
    selection$: Observable<RecordSelection> = this.data.selection$;
    sort$: Observable<SortingSelection> = this.data.sort$;
    dataSource$: ListViewStore = this.data;

    vm$ = combineLatest([
        this.language$,
        this.listMetadata$,
        this.selection$
    ]).pipe(
        map((
            [
                language,
                listMetadata,
                selection,
            ]
        ) => {
            const displayedColumns: string[] = ['checkbox'];

            listMetadata.fields.forEach((field) => {
                displayedColumns.push(field.fieldName);
            });

            return {
                language,
                listMetadata,
                selected: selection.selected,
                selectionStatus: selection.status,
                displayedColumns,
            };
        })
    );

    constructor(
        protected language: LanguageStore,
        protected metadata: MetadataStore,
        protected data: ListViewStore
    ) {
    }

    toggleSelection(id: string): void {
        this.data.toggleSelection(id);
    }

    allSelected(status: SelectionStatus): boolean {
        return status === SelectionStatus.ALL;
    }

    getFieldLabel(label: string): string {
        const module = this.data.appState.module;
        const languages = this.data.appData.language;
        return this.language.getFieldLabel(label, module, languages);
    }

    getFieldSort(field: Field): SortDirectionDataSource {
        return {
            getSortDirection: (): Observable<SortDirection> => this.sort$.pipe(
                map((sort: SortingSelection) => {
                    let direction = SortDirection.NONE;

                    if (sort.orderBy === field.fieldName) {
                        direction = sort.sortOrder;
                    }

                    return direction;
                })
            ),
            changeSortDirection: (direction: SortDirection): void => {
                this.changeSort(field.fieldName, direction);
            }
        } as SortDirectionDataSource;
    }

    protected changeSort(orderBy: string, sortOrder: SortDirection): void {
        this.data.updateSorting(orderBy, sortOrder);
    }
}

