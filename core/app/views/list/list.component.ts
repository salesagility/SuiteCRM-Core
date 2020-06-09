import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppState, AppStateStore} from '@store/app-state/app-state.store';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {ListViewStore} from '@store/list-view/list-view.store';

@Component({
    selector: 'scrm-list',
    templateUrl: './list.component.html',
    styleUrls: [],
    providers: [ListViewStore]
})
export class ListComponent implements OnInit, OnDestroy {
    appState$: Observable<AppState> = this.appState.vm$;
    listSub: Subscription;

    vm$ = combineLatest([this.appState$]).pipe(
        map(([appState]) => ({
            appState,
        }))
    );

    constructor(protected appState: AppStateStore, protected listStore: ListViewStore) {

    }

    ngOnInit(): void {
        this.listSub = this.listStore.init(this.appState.getModule()).subscribe();
    }

    ngOnDestroy(): void {
        if (this.listSub) {
            this.listSub.unsubscribe();
        }

        this.listStore.destroy();
    }
}
