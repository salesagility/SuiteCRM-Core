import {Component, Input, OnInit} from '@angular/core';
import {ListViewStore} from '@store/list-view/list-view.store';
import {ScreenSize} from '@services/ui/screen-size-observer/screen-size-observer.service';
import {Observable} from 'rxjs';
import {TableConfig} from '@components/table/table.model';
import {TableAdapter} from '@store/list-view/adapters/table.adapter';
import {MaxColumnsCalculator} from '@services/ui/max-columns-calculator/max-columns-calculator.service';

@Component({
    selector: 'scrm-list-container',
    templateUrl: 'list-container.component.html',
    providers: [TableAdapter, MaxColumnsCalculator]
})

export class ListContainerComponent implements OnInit {
    @Input() module;
    type = '';
    widgetTitle = '';
    screen: ScreenSize = ScreenSize.Medium;
    maxColumns = 5;
    tableConfig: TableConfig;

    constructor(
        public store: ListViewStore,
        protected adapter: TableAdapter,
        protected maxColumnCalculator: MaxColumnsCalculator
    ) {
    }

    ngOnInit(): void {
        this.tableConfig = this.adapter.getTable();
        this.tableConfig.maxColumns$ = this.getMaxColumns();
    }

    getMaxColumns(): Observable<number> {
        return this.maxColumnCalculator.getMaxColumns(this.store.widgets$);
    }

    getDisplayWidgets(): boolean {
        const display = this.store.showWidgets;
        if (display) {
            this.type = 'chart';
            this.widgetTitle = 'LBL_QUICK_CHARTS';
        }
        return display;
    }
}
