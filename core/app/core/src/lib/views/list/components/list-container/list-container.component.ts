/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Component, Input, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {ViewContext} from 'common';
import {map} from 'rxjs/operators';
import {MaxColumnsCalculator} from '../../../../services/ui/max-columns-calculator/max-columns-calculator.service';
import {LanguageStore} from '../../../../store/language/language.store';
import {ScreenSize} from '../../../../services/ui/screen-size-observer/screen-size-observer.service';
import {ListViewStore} from '../../store/list-view/list-view.store';
import {TableConfig} from '../../../../components/table/table.model';
import {TableAdapter} from '../../adapters/table.adapter';
import {ListViewSidebarWidgetAdapter} from '../../adapters/sidebar-widget.adapter';
import {WidgetMetadata} from 'common';

export interface ListContainerState {
    sidebarWidgetConfig: {
        widgets: WidgetMetadata[];
        show: boolean;
        widgetsEnabled: boolean;
    }
}

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

    vm$: Observable<ListContainerState> = combineLatest([this.sidebarWidgetAdapter.config$]).pipe(
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
