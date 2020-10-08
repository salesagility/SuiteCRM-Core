import {Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/collections';
import {BulkActionDataSource, SelectionDataSource} from '@components/bulk-action-menu/bulk-action-menu.component';
import {PaginationDataSource} from '@components/pagination/pagination.model';
import {ColumnDefinition} from '@app-common/metadata/list.metadata.model';
import {Record} from '@app-common/record/record.model';
import {SortDirection} from '@components/sort-button/sort-button.model';
import {LineAction} from '@app-common/actions/line-action.model';
import {SortingSelection} from '@app-common/views/list/list-navigation.model';
import {RecordSelection} from '@app-common/views/list/record-selection.model';

export interface TableConfig {
    showHeader: boolean;
    showFooter: boolean;

    dataSource: DataSource<Record>;

    columns: Observable<ColumnDefinition[]>;
    maxColumns$: Observable<number>;
    lineActions$?: Observable<LineAction[]>;
    selection$?: Observable<RecordSelection>;
    sort$?: Observable<SortingSelection>;
    loading$?: Observable<boolean>;

    selection?: SelectionDataSource;
    bulkActions?: BulkActionDataSource;
    pagination?: PaginationDataSource;

    toggleRecordSelection(id: string): void;

    updateSorting(orderBy: string, sortOrder: SortDirection): void;
}
