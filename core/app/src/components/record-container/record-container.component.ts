import {Component, Input, OnInit} from '@angular/core';
import {RecordViewStore} from '@store/record-view/record-view.store';

@Component({
    selector: 'scrm-record-container',
    templateUrl: 'record-container.component.html'

})

export class RecordContainerComponent implements OnInit {
    @Input() module;

    constructor(public recordViewStore: RecordViewStore) {
    }

    getDisplayWidgets(): boolean {
        return this.recordViewStore.showWidgets;
    }

    ngOnInit(): void {
    }
}
