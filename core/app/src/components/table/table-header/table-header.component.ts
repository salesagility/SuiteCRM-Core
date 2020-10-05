import {Component, Input} from '@angular/core';
import {BulkActionDataSource, SelectionDataSource} from '@components/bulk-action-menu/bulk-action-menu.component';
import {PaginationDataSource} from '@components/pagination/pagination.model';

@Component({
    selector: 'scrm-table-header',
    templateUrl: 'table-header.component.html',
})
export class TableHeaderComponent {
    @Input() selection: SelectionDataSource;
    @Input() bulkActions: BulkActionDataSource;
    @Input() pagination: PaginationDataSource;
}
