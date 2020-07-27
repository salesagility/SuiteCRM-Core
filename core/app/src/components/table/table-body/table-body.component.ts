import {Component, Input} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStrings} from '@store/language/language.store';
import {Field, ListViewMeta, MetadataStore} from '@store/metadata/metadata.store.service';
import {map} from 'rxjs/operators';
import {ListViewStore, RecordSelection, SortingSelection} from '@store/list-view/list-view.store';
import {SelectionStatus} from '@components/bulk-action-menu/bulk-action-menu.component';
import {SortDirection, SortDirectionDataSource} from '@components/sort-button/sort-button.model';
import {ScreenSize, ScreenSizeObserverService} from '@services/ui/screen-size-observer/screen-size-observer.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';

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
    screen: ScreenSize = ScreenSize.Medium;
    maxColumns = 5;

    vm$ = combineLatest([
        this.language$,
        this.listMetadata$,
        this.selection$,
        this.screenSize.screenSize$,
        this.data.widgets$
    ]).pipe(
        map((
            [
                language,
                listMetadata,
                selection,
                screenSize,
                widgets
            ]
        ) => {
            const displayedColumns: string[] = ['checkbox'];
            const sideBarOpen = widgets;

            if (screenSize) {
                this.screen = screenSize;
            }

            this.calculateMaxColumns(sideBarOpen);

            const columns = this.buildDisplayColumns(listMetadata);
            displayedColumns.push(...columns);

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
        protected data: ListViewStore,
        protected screenSize: ScreenSizeObserverService,
        protected systemConfigStore: SystemConfigStore
    ) {
    }

    toggleSelection(id: string): void {
        this.data.toggleSelection(id);
    }

    allSelected(status: SelectionStatus): boolean {
        return status === SelectionStatus.ALL;
    }

    buildDisplayColumns(listMetadata): string[] {
        let i = 0;
        let hasLinkField = false;
        const returnArray = [];
        while (i < this.maxColumns && i < listMetadata.fields.length) {
            returnArray.push(listMetadata.fields[i].fieldName);
            hasLinkField = hasLinkField || listMetadata.fields[i].link;
            i++;
        }
        if (!hasLinkField && (this.maxColumns < listMetadata.fields.length)) {
            for (i = this.maxColumns; i < listMetadata.fields.length; i++) {
                if (listMetadata.fields[i].link) {
                    returnArray.splice(-1,1);
                    returnArray.push(listMetadata.fields[i].fieldName);
                    break;
                }
            }
        }
        return returnArray;
    }

    calculateMaxColumns(sideBar = true): void {
        let sizeMap;
        sizeMap = this.systemConfigStore.getConfigValue('listview_column_limits');

        if (sideBar) {
            sizeMap = sizeMap.with_sidebar;
        } else {
            sizeMap = sizeMap.without_sidebar;
        }

        if (this.screen && sizeMap) {
            const maxCols = sizeMap[this.screen];
            if (maxCols) {
                this.maxColumns = maxCols;
            }
        }
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

