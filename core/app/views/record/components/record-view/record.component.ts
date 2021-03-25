import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppStateStore} from '@store/app-state/app-state.store';
import {Observable, Subscription} from 'rxjs';
import {RecordViewStore} from '@views/record/store/record-view/record-view.store';
import {ActivatedRoute} from '@angular/router';
import {RecordViewModel} from '@views/record/store/record-view/record-view.store.model';
import {ViewMode} from '@app-common/views/view.model';

@Component({
    selector: 'scrm-record',
    templateUrl: './record.component.html',
    styleUrls: [],
    providers: [RecordViewStore]
})
export class RecordComponent implements OnInit, OnDestroy {
    recordSub: Subscription;
    vm$: Observable<RecordViewModel> = null;
    showStatusBar = false;

    constructor(protected appState: AppStateStore, protected recordStore: RecordViewStore, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        let mode = 'detail' as ViewMode;
        const data = (this.route.snapshot && this.route.snapshot.data) || {};

        if (data.mode) {
            mode = data.mode;
        }

        this.recordSub = this.recordStore.init(this.appState.getModule(), this.route.snapshot.params.record, mode).subscribe();
        this.vm$ = this.recordStore.vm$;
    }

    ngOnDestroy(): void {
        if (this.recordSub) {
            this.recordSub.unsubscribe();
        }

        this.recordStore.destroy();
    }
}
