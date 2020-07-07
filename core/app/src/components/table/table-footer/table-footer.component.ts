import {Component} from '@angular/core';
import {BulkActionDataSource, SelectionDataSource} from '@components/bulk-action-menu/bulk-action-menu.component';
import {ListViewStore} from '@store/list-view/list-view.store';
import {PaginationDataSource} from '@components/pagination/pagination.model';

@Component({
    selector: 'scrm-table-footer',
    templateUrl: 'table-footer.component.html',
})
export class TableFooterComponent {
    selectionState: SelectionDataSource = this.data;
    actionState: BulkActionDataSource = this.data;
    paginationState: PaginationDataSource = this.data;

    constructor(
        protected data: ListViewStore
    ) {
    }
}
