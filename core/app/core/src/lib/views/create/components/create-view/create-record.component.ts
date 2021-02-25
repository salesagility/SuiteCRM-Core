import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {CreateViewStore} from '../../store/create-view/create-view.store';
import {RecordViewStore} from '../../../record/store/record-view/record-view.store';
import {RecordViewModel} from '../../../record/store/record-view/record-view.store.model';
import {AppStateStore} from '../../../../store/app-state/app-state.store';
import {ViewMode} from 'common';

@Component({
    selector: 'scrm-create-record',
    templateUrl: './create-record.component.html',
    styleUrls: [],
    providers: [
        CreateViewStore,
        {
            provide: RecordViewStore,
            useExisting: CreateViewStore
        }
    ]
})
export class CreateRecordComponent implements OnInit, OnDestroy {
    recordSub: Subscription;
    vm$: Observable<RecordViewModel> = null;
    showStatusBar = false;

    constructor(protected appState: AppStateStore, protected recordStore: CreateViewStore, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        let mode = 'detail' as ViewMode;
        const data = (this.route.snapshot && this.route.snapshot.data) || {};

        if (data.mode) {
            mode = data.mode;
        }

        const params = (this.route.snapshot && this.route.snapshot.queryParams) || {} as Params;

        this.recordSub = this.recordStore.init(this.appState.getModule(), this.route.snapshot.params.record, mode, params).subscribe();
        this.vm$ = this.recordStore.vm$;
    }

    ngOnDestroy(): void {
        if (this.recordSub) {
            this.recordSub.unsubscribe();
        }

        this.recordStore.destroy();
    }
}
