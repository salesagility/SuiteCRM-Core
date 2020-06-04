import {Component, Input} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStrings} from '@store/language/language.store';
import {ListViewMeta, ListViewMetaStore} from '@store/list-view-meta/list-view-meta.store';
import {map} from 'rxjs/operators';
import {ListEntry, ListViewStore} from '@store/list-view/list-view.store';
import {DataSource} from '@angular/cdk/table';

@Component({
    selector: 'scrm-table-body-ui',
    templateUrl: 'table-body.component.html',
})
export class TablebodyUiComponent {
    @Input() module;
    language$: Observable<LanguageStrings> = this.language.vm$;
    metadata$: Observable<ListViewMeta> = this.metadata.vm$;
    dataSource$: DataSource<ListEntry> = this.data;

    vm$ = combineLatest([
        this.language$,
        this.metadata$,
    ]).pipe(
        map((
            [
                language,
                metadata
            ]
        ) => {
            const displayedColumns: string[] = ['checkbox'];

            metadata.fields.forEach((field) => {
                displayedColumns.push(field.fieldName);
            });

            return {
                language,
                metadata,
                displayedColumns
            };
        })
    );

    constructor(
        protected language: LanguageStore,
        protected metadata: ListViewMetaStore,
        protected data: ListViewStore
    ) {
    }
}

