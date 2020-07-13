import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ChartTypesMap} from '@store/metadata/metadata.store.service';
import {LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';
import {ListViewStore} from '@store/list-view/list-view.store';

export interface ChartTypesDataSource {
    getChartTypes(): Observable<ChartTypesMap>;
}

export interface ChartsViewModel {
    appStrings: LanguageStringMap;
    types: ChartTypesMap;
}

@Component({
    selector: 'scrm-chart-ui',
    templateUrl: './chart.component.html',
    styleUrls: []
})
export class ChartUiComponent implements OnInit {
    constructor(protected languageStore: LanguageStore, protected listStore: ListViewStore) {
    }

    ngOnInit(): void {
    }

    getDropdownConfig(): DropdownButtonInterface {
        if (!this.listStore) {
            return null;
        }
        const chartTypes = this.listStore.getChartTypes();
        const dropdownConfig = {
            klass: ['widget-transparent-button', 'btn-block', 'dropdown-toggle'],
            wrapperKlass: ['action-group', 'float-left'],
            items: []
        } as DropdownButtonInterface;


        dropdownConfig.items.push({
            label: this.listStore.appStrings && this.listStore.appStrings[chartTypes.labelKey] || '',
            klass: ['chart-item'],
            onClick: (): void => {
            }
        });


        return dropdownConfig;
    }
}
