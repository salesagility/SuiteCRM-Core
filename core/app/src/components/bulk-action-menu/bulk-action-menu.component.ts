import {Component, Input, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {map} from 'rxjs/operators';
import {BulkActionsMap} from '@store/metadata/metadata.store.service';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';

export enum SelectionStatus {
    ALL = 'ALL',
    SOME = 'SOME',
    PAGE = 'PAGE',
    NONE = 'NONE',
}

export interface SelectionDataSource {
    getSelectionStatus(): Observable<SelectionStatus>;

    getSelectedCount(): Observable<number>;

    updateSelection(state: SelectionStatus): void;
}

export interface BulkActionDataSource {
    getBulkActions(): Observable<BulkActionsMap>;

    executeBulkAction(action: string): void;
}

export interface BulkActionViewModel {
    appStrings: LanguageStringMap;
    status: SelectionStatus;
    count: number;
    actions: BulkActionsMap;
}

@Component({
    selector: 'scrm-bulk-action-menu',
    templateUrl: 'bulk-action-menu.component.html'
})
export class BulkActionMenuComponent implements OnInit {

    @Input() selectionSource: SelectionDataSource;
    @Input() actionSource: BulkActionDataSource;

    appStrings$: Observable<LanguageStringMap> = this.languageStore.appStrings$;

    vm$: Observable<BulkActionViewModel> = null;

    constructor(protected languageStore: LanguageStore) {
    }

    ngOnInit(): void {
        const status$ = this.selectionSource.getSelectionStatus();
        const count$ = this.selectionSource.getSelectedCount();
        const actions$ = this.actionSource.getBulkActions();
        this.vm$ = combineLatest([this.appStrings$, status$, count$, actions$]).pipe(
            map(([appStrings, status, count, actions]) => ({appStrings, status, count, actions}))
        );
    }

    checked(status: SelectionStatus): boolean {
        return status === SelectionStatus.ALL;
    }

    intermediate(status: SelectionStatus): boolean {
        return status === SelectionStatus.SOME || status === SelectionStatus.PAGE;
    }

    selectPage(): void {
        this.selectionSource.updateSelection(SelectionStatus.PAGE);
    }

    selectAll(): void {
        this.selectionSource.updateSelection(SelectionStatus.ALL);
    }

    deselectAll(): void {
        this.selectionSource.updateSelection(SelectionStatus.NONE);
    }

    toggleSelection(status: SelectionStatus): void {
        if (status === SelectionStatus.ALL) {
            this.selectionSource.updateSelection(SelectionStatus.NONE);
            return;
        }

        this.selectionSource.updateSelection(SelectionStatus.ALL);
    }

    getDropdownConfig(actions: BulkActionsMap, appStrings: LanguageStringMap): DropdownButtonInterface {
        const label = appStrings && appStrings.LBL_BULK_ACTION_BUTTON_LABEL || '';
        const dropdownConfig = {
            label,
            klass: ['bulk-action-button', 'btn', 'btn-sm'],
            wrapperKlass: ['bulk-action-group', 'float-left'],
            items: []
        } as DropdownButtonInterface;

        Object.keys(actions).forEach(actionKey => {
            const action = actions[actionKey];
            dropdownConfig.items.push({
                label: appStrings && appStrings[action.labelKey] || '',
                klass: [`${actionKey}-bulk-action`],
                onClick: (): void => {
                    this.actionSource.executeBulkAction(action.key);
                }
            });
        });

        return dropdownConfig;
    }
}
