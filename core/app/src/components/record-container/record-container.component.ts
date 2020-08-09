import {Component, Input, OnInit} from '@angular/core';
import {RecordViewStore} from '@store/record-view/record-view.store';

@Component({
    selector: 'scrm-record-container',
    templateUrl: 'record-container.component.html'

})

export class RecordContainerComponent implements OnInit {
    @Input() module;
    type = '';
    widgetTitle = '';

    constructor(public recordViewStore: RecordViewStore) {
    }

    getDisplayWidgets(): boolean {
        const display = this.recordViewStore.showWidgets;
        if (display) {
            this.type = 'history';
            this.widgetTitle = 'LBL_QUICK_HISTORY';
        }
        return display;
    }

    ngOnInit(): void {
    }
}
