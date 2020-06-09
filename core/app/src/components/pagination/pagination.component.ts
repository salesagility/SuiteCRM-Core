import {Component, Input, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {map} from 'rxjs/operators';
import {PageSelection, PaginationCount, PaginationDataSource} from '@components/pagination/pagination.model';

export interface PaginationViewModel {
    appStrings: LanguageStringMap;
    pageCount: PaginationCount;
}

@Component({
    selector: 'scrm-pagination',
    templateUrl: 'pagination.component.html'
})
export class PaginationComponent implements OnInit {

    @Input() state: PaginationDataSource;
    displayResponsiveTable: any;

    appStrings$: Observable<LanguageStringMap> = this.languageStore.appStrings$;
    vm$: Observable<PaginationViewModel> = null;

    constructor(protected languageStore: LanguageStore) {
    }

    ngOnInit(): void {
        const pageCount$ = this.state.getPaginationCount();

        this.vm$ = combineLatest([this.appStrings$, pageCount$]).pipe(
            map(([appStrings, pageCount]) => ({appStrings, pageCount}))
        );
    }

    first(): void {
        this.state.changePage(PageSelection.FIRST);
    }

    previous(): void {
        this.state.changePage(PageSelection.PREVIOUS);
    }

    next(): void {
        this.state.changePage(PageSelection.NEXT);
    }

    last(): void {
        this.state.changePage(PageSelection.LAST);
    }
}
