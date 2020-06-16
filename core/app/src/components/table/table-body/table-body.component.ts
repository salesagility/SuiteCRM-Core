import {Component, Input} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStrings} from '@store/language/language.store';
import {ListViewMeta, MetadataStore} from '@store/metadata/metadata.store.service';
import {map} from 'rxjs/operators';
import {ListViewStore, RecordSelection} from '@store/list-view/list-view.store';
import {SelectionStatus} from '@components/bulk-action-menu/bulk-action-menu.component';

@Component({
    selector: 'scrm-table-body',
    templateUrl: 'table-body.component.html',
})
export class TableBodyComponent {
    @Input() module;
    language$: Observable<LanguageStrings> = this.language.vm$;
    listMetadata$: Observable<ListViewMeta> = this.metadata.listMetadata$;
    selection$: Observable<RecordSelection> = this.data.selection$;
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
                selection
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
                displayedColumns
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
}

