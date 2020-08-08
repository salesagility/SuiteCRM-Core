import {Component, Input, OnInit} from '@angular/core';
import {ListViewStore} from '@store/list-view/list-view.store';

@Component({
    selector: 'scrm-list-container-ui',
    templateUrl: 'list-container.component.html'

})

export class ListcontainerUiComponent implements OnInit {
    @Input() module;
    type = '';

    constructor(public listViewStore: ListViewStore) {
    }

    getDisplayWidgets(): boolean {
        const display = this.listViewStore.showWidgets;
        if (display) {
            this.type = 'chart';
        }
        return display;
    }

    ngOnInit(): void {
    }
}
