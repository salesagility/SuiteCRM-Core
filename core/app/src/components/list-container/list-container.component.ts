import {Component, Input, OnInit} from '@angular/core';
import {ListViewStore} from '@store/list-view/list-view.store';
import {ScreenSize, ScreenSizeObserverService} from '@services/ui/screen-size-observer/screen-size-observer.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TableConfig} from '@components/table/table.model';
import {TableAdapter} from '@store/list-view/adapters/table.adapter';

@Component({
    selector: 'scrm-list-container',
    templateUrl: 'list-container.component.html',
    providers: [TableAdapter]
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
        protected screenSize: ScreenSizeObserverService,
        protected systemConfigStore: SystemConfigStore,
        protected adapter: TableAdapter
    ) {
    }

    ngOnInit(): void {
        this.tableConfig = this.adapter.getTable();
        this.tableConfig.maxColumns$ = this.getMaxColumns();
    }

    calculateMaxColumns(sideBar = true): number {
        let sizeMap;
        sizeMap = this.systemConfigStore.getConfigValue('listview_column_limits');

        if (sideBar) {
            sizeMap = sizeMap.with_sidebar;
        } else {
            sizeMap = sizeMap.without_sidebar;
        }

        if (this.screen && sizeMap) {
            const maxCols = sizeMap[this.screen];
            if (maxCols) {
                this.maxColumns = maxCols;
            }
        }

        return this.maxColumns;
    }

    getMaxColumns(): Observable<number> {
        return combineLatest([this.store.widgets$, this.screenSize.screenSize$]).pipe(
            map(([widgets, screenSize]) => {

                if (screenSize) {
                    this.screen = screenSize;
                }

                return this.calculateMaxColumns(widgets);
            })
        );
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
