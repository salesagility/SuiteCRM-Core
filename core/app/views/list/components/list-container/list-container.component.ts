import {Component, Input, OnInit} from '@angular/core';
import {ListViewStore} from '@views/list/store/list-view/list-view.store';
import {ScreenSize} from '@services/ui/screen-size-observer/screen-size-observer.service';
import {combineLatest, Observable} from 'rxjs';
import {TableConfig} from '@components/table/table.model';
import {TableAdapter} from '@views/list/adapters/table.adapter';
import {MaxColumnsCalculator} from '@services/ui/max-columns-calculator/max-columns-calculator.service';
import {LanguageStore} from '@store/language/language.store';
import {ViewContext} from '@app-common/views/view.model';
import {ListViewSidebarWidgetAdapter} from '@views/list/adapters/sidebar-widget.adapter';
import {map} from 'rxjs/operators';

@Component({
    selector: 'scrm-list-container',
    templateUrl: 'list-container.component.html',
    providers: [TableAdapter, MaxColumnsCalculator, ListViewSidebarWidgetAdapter],
})

export class ListContainerComponent implements OnInit {
    @Input() module;
    screen: ScreenSize = ScreenSize.Medium;
    maxColumns = 5;
    tableConfig: TableConfig;

    vm$ = combineLatest([this.sidebarWidgetAdapter.config$]).pipe(
        map((
            [sidebarWidgetConfig]
        ) => ({
            sidebarWidgetConfig,
        }))
    );

    constructor(
        public store: ListViewStore,
        protected adapter: TableAdapter,
        protected maxColumnCalculator: MaxColumnsCalculator,
        public languageStore: LanguageStore,
        protected sidebarWidgetAdapter: ListViewSidebarWidgetAdapter
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
        return this.store.widgets && this.store.showSidebarWidgets;
    }

    getDisplay(display: boolean): string {
        let displayType = 'none';

        if (display) {
            displayType = 'block';
        }

        return displayType;
    }

    getViewContext(): ViewContext {
        return this.store.getViewContext();
    }
}
