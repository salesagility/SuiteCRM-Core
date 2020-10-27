import {combineLatest, Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {LanguageStore} from '@store/language/language.store';
import {SortDirection} from '@components/sort-button/sort-button.model';
import {TableConfig} from '@components/table/table.model';
import {ColumnDefinition} from '@app-common/metadata/list.metadata.model';
import {SubpanelStore} from '@containers/subpanel/store/subpanel/subpanel.store';
import {map} from 'rxjs/operators';

@Injectable()
export class SubpanelTableAdapter {

    constructor(
        protected store: SubpanelStore,
        protected language: LanguageStore
    ) {
    }

    getTable(): TableConfig {
        return {
            showHeader: false,
            showFooter: true,

            columns: this.getColumns(),
            sort$: this.store.recordList.sort$,
            maxColumns$: of(5),
            loading$: this.store.recordList.loading$,

            dataSource: this.store.recordList,
            pagination: this.store.recordList,

            toggleRecordSelection: (id: string): void => {
                this.store.recordList.toggleSelection(id);
            },

            updateSorting: (orderBy: string, sortOrder: SortDirection): void => {
                this.store.recordList.updateSorting(orderBy, sortOrder);
            },
        } as TableConfig;
    }

    protected getColumns(): Observable<ColumnDefinition[]> {

        return combineLatest([this.language.vm$, this.store.metadata$]).pipe(
            map(([languages, metadata]) => {
                const mapped: ColumnDefinition[] = [];

                metadata.columns.forEach(column => {
                    const translatedLabel = this.language.getFieldLabel(column.label, metadata.headerModule, languages);
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
