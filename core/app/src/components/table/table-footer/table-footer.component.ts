import {Component} from '@angular/core';
import {SelectionDataSource} from '@components/bulk-action-menu/bulk-action-menu.component';
import {ListViewStore} from '@store/list-view/list-view.store';

@Component({
    selector: 'scrm-table-footer',
    templateUrl: 'table-footer.component.html',
})
export class TableFooterComponent {
    selectionState: SelectionDataSource = this.data;

    constructor(
        protected data: ListViewStore
    ) {
    }
}
