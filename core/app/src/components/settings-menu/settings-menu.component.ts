import {Component, OnInit} from '@angular/core';
import {ListViewStore} from '@store/list-view/list-view.store';
import {ButtonInterface} from '@components/button/button.model';

@Component({
    selector: 'scrm-settings-menu',
    templateUrl: 'settings-menu.component.html',

})
export class SettingsMenuComponent implements OnInit {

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

    get widgetButton(): ButtonInterface {
        if (!this.listStore) {
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

    ngOnInit(): void {

    }
}
