import {Component, Input} from '@angular/core';
import {BulkActionDataSource, SelectionDataSource} from '@components/bulk-action-menu/bulk-action-menu.component';
import {PaginationDataSource} from '@components/pagination/pagination.model';

@Component({
    selector: 'scrm-table-footer',
    templateUrl: 'table-footer.component.html',
})
export class TableFooterComponent {
    @Input() selection: SelectionDataSource;
    @Input() bulkActions: BulkActionDataSource;
    @Input() pagination: PaginationDataSource;
}
