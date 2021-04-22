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

import {Component, OnInit} from '@angular/core';
import {ButtonGroupInterface, ButtonInterface, DropdownButtonInterface, SearchCriteriaFilter} from 'common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {ListViewStore} from '../../store/list-view/list-view.store';
import {SystemConfigStore} from '../../../../store/system-config/system-config.store';
import {
    ScreenSize,
    ScreenSizeObserverService
} from '../../../../services/ui/screen-size-observer/screen-size-observer.service';
import {SavedFilter, SavedFilterMap} from '../../../../store/saved-filters/saved-filter.model';

@Component({
    selector: 'scrm-settings-menu',
    templateUrl: 'settings-menu.component.html',

})
export class SettingsMenuComponent implements OnInit {

    configState = new BehaviorSubject<ButtonGroupInterface>({buttons: []});
    config$ = this.configState.asObservable();

    vm$ = combineLatest([
        this.listStore.widgets$,
        this.listStore.displayFilters$,
        this.listStore.criteria$,
        this.screenSize.screenSize$,
        this.listStore.showSidebarWidgets$,
        this.listStore.filterList.records$
    ]).pipe(
        map((
            [
                widgets,
                displayFilters,
                criteria,
                screenSize,
                showSidebarWidgets,
                savedFilters
            ]
        ) => {
            if (screenSize) {
                this.screen = screenSize;
            }
            this.configState.next(this.getButtonGroupConfig());
            return {widgets, displayFilters, criteria, screenSize, showSidebarWidgets, savedFilters};
        })
    );

    protected screen: ScreenSize = ScreenSize.Medium;
    protected defaultBreakpoint = 5;
    protected breakpoint: number;

    constructor(
        protected listStore: ListViewStore,
        protected modalService: NgbModal,
        protected screenSize: ScreenSizeObserverService,
        protected systemConfigStore: SystemConfigStore
    ) {
    }

    ngOnInit(): void {
        this.configState.next(this.getButtonGroupConfig());
    }

    getButtonGroupConfig(): ButtonGroupInterface {

        const availableButtons = [
            // Commented temporarily as it is not implemented
            /*
            {button: this.getDisplayAsButton()},
             */
            {
                show: (): boolean => this.listStore.filterList.getFilters() && this.listStore.filterList.getFilters().length >= 1,
                button: this.getMyFiltersButton(),
            },
            {button: this.getFilterButton()},
            {
                show: (): boolean => !Object.keys(this.getFilters()).every(key => this.getFilters()[key].operator === ''),
                button: this.getClearButton(),
            },
            {button: this.getColumnChooserButton()},
            {
                show: (): boolean => this.listStore.widgets,
                button: this.getChartsButton(),
            },
        ];

        const config = {
            buttonKlass: ['settings-button'],
            dropdownLabel: this.listStore.appStrings.LBL_OPTIONS || '',
            breakpoint: this.getBreakpoint(),
            dropdownOptions: {
                placement: ['bottom-right'],
                wrapperKlass: ['dropdown-button-secondary']
            },
            buttons: []
        } as ButtonGroupInterface;

        availableButtons.forEach(availableButton => {
            if (!availableButton.show) {
                config.buttons.push(availableButton.button);
                return;
            }

            if (availableButton.show()) {
                config.buttons.push(availableButton.button);
            }
        });

        return config;
    }

    getFilters(): SearchCriteriaFilter {
        return this.listStore.recordList.criteria.filters;
    }

    getBreakpoint(): number {

        const breakpointMap = this.systemConfigStore.getConfigValue('listview_settings_limits');

        if (this.screen && breakpointMap && breakpointMap[this.screen]) {
            this.breakpoint = breakpointMap[this.screen];
            return this.breakpoint;
        }

        if (this.breakpoint) {
            return this.breakpoint;
        }

        return this.defaultBreakpoint;
    }


    getFilterButton(): DropdownButtonInterface {

        return {
            label: this.listStore.appStrings.LBL_FILTER || '',
            klass: {
                'filter-settings-button': true,
                active: this.listStore.showFilters
            },
            icon: 'filter',
            onClick: (): void => {
                this.listStore.showFilters = !this.listStore.showFilters;
            }
        } as ButtonInterface;
    }

    getMyFiltersButton(): DropdownButtonInterface {
        const filters = this.listStore.filterList.getFilters();

        const dropdownConfig = {
            label: this.listStore.appStrings.LBL_SAVED_FILTER_SHORTCUT || '',
            klass: ['dropdown-toggle'],
            wrapperKlass: ['filter-action-group'],
            items: []
        } as DropdownButtonInterface;

        const activeFilters = this.listStore.activeFilters;

        filters.forEach((filter: SavedFilter) => {

            const isActive = Object.keys(activeFilters).some(key => key === filter.key);

            const button = {
                label: filter.attributes.name,
                onClick: (): void => {
                    this.listStore.showFilters = false;

                    if (isActive) {
                        this.listStore.resetFilters();

                    } else {
                        this.listStore.setOpenFilter(filter);
                        const selectedFilters = {} as SavedFilterMap;
                        selectedFilters[filter.key] = filter;
                        this.listStore.setFilters(selectedFilters);
                    }

                }
            } as ButtonInterface;


            if (isActive) {
                button.icon = 'filter';
                button.iconKlass = 'small';
                button.klass = ['active'];
            }

            dropdownConfig.items.push(button);
        });

        return dropdownConfig;
    }

    getClearButton(): ButtonInterface {
        return {
            label: this.listStore.appStrings.LBL_CLEAR_BUTTON_LABEL || '',
            icon: 'filter',
            onClick: (): void => {
                this.listStore.showFilters = false;
                this.listStore.resetFilters();
            }
        };
    }

    getChartsButton(): ButtonInterface {

        return {
            label: this.listStore.appStrings.LBL_INSIGHTS || '',
            klass: {
                active: this.listStore.showSidebarWidgets
            },
            icon: 'pie',
            onClick: (): void => {
                this.listStore.showSidebarWidgets = !this.listStore.showSidebarWidgets;
            }
        };
    }

    getDisplayAsButton(): DropdownButtonInterface {

        return {
            label: 'Display As',
            klass: {},
            items: []
        };
    }

    getColumnChooserButton(): ButtonInterface {

        return {
            label: this.listStore.appStrings.LBL_COLUMNS || '',
            klass: {
                'column-chooser-button': true,
            },
            icon: 'column_chooser',
            onClick: (): void => {
                this.listStore.openColumnChooserDialog();
            }
        };
    }
}
