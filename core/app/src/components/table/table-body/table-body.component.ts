import {Component, Input} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStrings} from '@store/language/language.store';
import {ListViewMetaStore} from '@store/metadata/list-view-meta.store';
import {map} from 'rxjs/operators';
import {MockDataSource} from './table-body-data.component';

@Component({
    selector: 'scrm-table-body-ui',
    templateUrl: 'table-body.component.html',
})
export class TablebodyUiComponent {
    @Input() module;
    language$: Observable<LanguageStrings> = this.language.vm$;
    metadata$: Observable<any> = this.metadata.vm$;
    dataSource = new MockDataSource();

    vm$ = combineLatest([
        this.language$,
        this.metadata$
    ]).pipe(
        map((
            [
                language,
                metadata
            ]
        ) => {
            const displayedColumns: string[] = [];

            metadata.fields.forEach((field) => {
                displayedColumns.push(field.fieldname);
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
        protected metadata: ListViewMetaStore
    ) {
    }
}

