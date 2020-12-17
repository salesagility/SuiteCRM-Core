import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppStateStore} from '@store/app-state/app-state.store';
import {Observable, Subscription} from 'rxjs';
import {ListViewModel, ListViewStore} from '@views/list/store/list-view/list-view.store';

@Component({
    selector: 'scrm-list',
    templateUrl: './list.component.html',
    styleUrls: [],
    providers: [ListViewStore]
})
export class ListComponent implements OnInit, OnDestroy {
    listSub: Subscription;

    vm$: Observable<ListViewModel> = null;

    constructor(protected appState: AppStateStore, protected listStore: ListViewStore) {

    }

    ngOnInit(): void {
        this.listSub = this.listStore.init(this.appState.getModule()).subscribe();
        this.vm$ = this.listStore.vm$;
    }

    ngOnDestroy(): void {
        if (this.listSub) {
            this.listSub.unsubscribe();
        }

        this.listStore.destroy();
    }
}
