import {combineLatest, Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {map} from 'rxjs/operators';
import {LanguageStore} from '@store/language/language.store';
import {SortDirection} from '@components/sort-button/sort-button.model';
import {TableConfig} from '@components/table/table.model';
import {ColumnDefinition} from '@app-common/metadata/list.metadata.model';
import {ListViewStore} from '../store/list-view/list-view.store';

@Injectable()
export class TableAdapter {

    constructor(
        protected store: ListViewStore,
        protected metadata: MetadataStore,
        protected language: LanguageStore
    ) {
    }

    getTable(): TableConfig {
        return {
            showHeader: true,
            showFooter: true,

            columns: this.getColumns(),
            lineActions$: this.store.lineActions$,
            selection$: this.store.selection$,
            sort$: this.store.sort$,
            maxColumns$: of(4),

            dataSource: this.store.recordList,
            selection: this.store.recordList,
            bulkActions: this.store,
            pagination: this.store.recordList,

            toggleRecordSelection: (id: string): void => {
                this.store.recordList.toggleSelection(id);
            },

            updateSorting: (orderBy: string, sortOrder: SortDirection): void => {
                this.store.recordList.updateSorting(orderBy, sortOrder);
                this.store.updateLocalStorage();
            },
        } as TableConfig;
    }

    protected getColumns(): Observable<ColumnDefinition[]> {
        return combineLatest(
            [this.language.vm$, this.store.columns$, this.store.moduleName$]
        ).pipe(
            map(([languages, columns, module]) => {
                const mapped: ColumnDefinition[] = [];

                columns.forEach(column => {
                    const translatedLabel = this.language.getFieldLabel(column.label, module, languages);
                    mapped.push({
                        ...column,
                        translatedLabel
                    });
                });

                return mapped;
            })
        );
    }
}
