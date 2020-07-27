import {Component, OnInit, NgModule} from '@angular/core';
import {Observable} from 'rxjs';
import {ChartTypesMap} from '@store/metadata/metadata.store.service';
import {LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';
import {ListViewStore, RecordSelection} from '@store/list-view/list-view.store';
import {BrowserModule} from '@angular/platform-browser';
import {NgxChartsModule} from '@swimlane/ngx-charts';

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
    selection$: Observable<RecordSelection> = this.listStore.selection$;
    data: any[];
    view: any[] = [500, 300];

    // options
    legend = false;
    showLabels = true;
    animations = true;
    xAxis = true;
    yAxis = true;
    showYAxisLabel = true;
    showXAxisLabel = true;
    xAxisLabel: string;
    yAxisLabel: string;
    timeline = true;
    type: string;

    colorScheme = {
        picnic: ['#a8385d', '#66BD6D', '#FAA026', '#29BB9C', '#E96B56', '#55ACD2']
    };

    constructor(protected languageStore: LanguageStore, protected listStore: ListViewStore) {
        Object.assign(this, this.selection$);
    }

    ngOnInit(): void {
        const chartTypes = this.listStore.getChartTypes();

        this.type = chartTypes.type;
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

    getTypeDropdownConfig(): DropdownButtonInterface {
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
            label: 'Display as ' + chartTypes.type,
            klass: ['chart-item'],
            onClick: (): void => {
            }
        });


        return dropdownConfig;
    }

    onSelect(data): void {
        console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data): void {
        console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data): void {
        console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }
}
