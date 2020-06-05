import {Component, Input, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {map} from 'rxjs/operators';

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

export interface BulkActionViewModel {
    appStrings: LanguageStringMap;
    status: SelectionStatus;
    count: number;
}

@Component({
    selector: 'scrm-bulk-action-menu',
    templateUrl: 'bulk-action-menu.component.html'
})
export class BulkActionMenuComponent implements OnInit {

    @Input() state: SelectionDataSource;

    appStrings$: Observable<LanguageStringMap> = this.languageStore.appStrings$;

    vm$: Observable<BulkActionViewModel> = null;

    constructor(protected languageStore: LanguageStore) {
    }

    ngOnInit(): void {
        const status$ = this.state.getSelectionStatus();
        const count$ = this.state.getSelectedCount();
        this.vm$ = combineLatest([this.appStrings$, status$, count$]).pipe(
            map(([appStrings, status, count]) => ({appStrings, status, count}))
        );
    }

    checked(status: SelectionStatus): boolean {
        return status === SelectionStatus.ALL;
    }

    intermediate(status: SelectionStatus): boolean {
        return status === SelectionStatus.SOME || status === SelectionStatus.PAGE;
    }

    selectPage(): void {
        this.state.updateSelection(SelectionStatus.PAGE);
    }

    selectAll(): void {
        this.state.updateSelection(SelectionStatus.ALL);
    }

    deselectAll(): void {
        this.state.updateSelection(SelectionStatus.NONE);
    }

    toggleSelection(status: SelectionStatus): void {
        if (status === SelectionStatus.ALL) {
            this.state.updateSelection(SelectionStatus.NONE);
            return;
        }

        this.state.updateSelection(SelectionStatus.ALL);
    }
}
