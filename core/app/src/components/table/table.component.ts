import {Component, Input} from '@angular/core';
import {TableConfig} from '@components/table/table.model';

@Component({
    selector: 'scrm-table',
    templateUrl: 'table.component.html',

})
export class TableComponent {
    @Input() config: TableConfig;

    showHeader(): boolean {
        return this.config.showHeader;
    }

    showFooter(): boolean {
        return this.config.showFooter;
    }
}
