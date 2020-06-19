import {Component, OnInit} from '@angular/core';
import {WidgetService} from '../widget/widget.service';
import {ListViewStore} from '@store/list-view/list-view.store';
import {ButtonInterface} from '@components/button/button.model';

@Component({
    selector: 'scrm-settings-menu',
    templateUrl: 'settings-menu.component.html',

})
export class SettingsMenuComponent implements OnInit {

    constructor(public widgetService: WidgetService, protected listStore: ListViewStore) {
    }

    toggleWidgets(): void {
        this.widgetService.emitData();
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
}
