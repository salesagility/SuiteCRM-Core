import {Component, OnInit} from '@angular/core';
import {ListViewStore, SearchCriteria} from '@store/list-view/list-view.store';
import {ButtonInterface} from '@components/button/button.model';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';

@Component({
    selector: 'scrm-settings-menu',
    templateUrl: 'settings-menu.component.html',

})
export class SettingsMenuComponent implements OnInit {

    searchCriteria: SearchCriteria;

    constructor(protected listStore: ListViewStore) {
    }

    get filterButton(): ButtonInterface {
        if (!this.listStore) {
            return null;
        }

        return {
            label: this.listStore.appStrings.LBL_FILTER || '',
            klass: {
                'filter-settings-button': true,
                'settings-button': true,
                active: this.listStore.showFilters
            },
            icon: 'filter',
            onClick: (): void => {
                this.listStore.showFilters = !this.listStore.showFilters;
            }
        };
    }

    ngOnInit(): void {
    }

    get myFiltersButton(): DropdownButtonInterface {
        if (!this.listStore) {
            return null;
        }

        const filters = this.listStore.getFilter();

        if (filters.length < 1) {
            return null;
        }

        const dropdownConfig = {
            label: this.listStore.appStrings.LBL_SAVED_FILTER_SHORTCUT || '',
            klass: ['settings-button', 'dropdown-toggle'],
            wrapperKlass: ['filter-action-group', 'float-left'],
            items: []
        } as DropdownButtonInterface;


        filters.forEach((filter: any) => {
            dropdownConfig.items.push({
                label: filter.name,
                onClick: (): void => {
                    const parsedFilter: any = [];
                    Object.keys(filter.filters).forEach(key => {
                        parsedFilter.push({
                            field: key,
                            operator: '=',
                            values: [filter.filters[key]],
                        });
                    });

                    const newItem = {
                        filter
                    };
                    parsedFilter.map(item => {
                        newItem.filter.filters[item.field] = parsedFilter[0];
                    });

                    this.listStore.updateSearchCriteria({filters: newItem.filter.filters});
                }
            });
        });

        return dropdownConfig;
    }

    get clearButton(): ButtonInterface {
        const searchCriteria = this.listStore.searchCriteria;
        const result = Object.values(searchCriteria.filters).every(item => item.operator === '');

        if (result) {
            return null;
        }

        return {
            label: this.listStore.appStrings.LBL_CLEAR_BUTTON_LABEL || '',
            klass: {
                'settings-button': true,
            },
            icon: 'filter',
            onClick: (): void => {
                this.listStore.updateSearchCriteria({filters: {}}, true);
            }
        };
    }

    get chartsButton(): ButtonInterface {
        if (!this.listStore) {
            return null;
        }

        const result = this.listStore.getChartTypes();

        if (result.length < 1) {
            this.listStore.showWidgets = false;
            return null;
        }

        return {
            label: this.listStore.appStrings.LBL_CHARTS || '',
            klass: {
                'settings-button': true,
                active: this.listStore.showWidgets
            },
            icon: 'pie',
            onClick: (): void => {
                this.listStore.showWidgets = !this.listStore.showWidgets;
            }
        };
    }
}
