import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {ChartTypesMap} from '@store/metadata/metadata.store.service';
import {LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {ListViewStore} from '@store/list-view/list-view.store';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';
import {PipelineBySalesStage} from '@components/chart/types/pipeline-by-sales-stage/pipeline-by-sales-stage.service';

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
    styleUrls: [],
    providers: [PipelineBySalesStage]
})
export class ChartUiComponent {
    type: string;
    chartKey: any;
    dataSource;
    private dataSourceMap: { [key: string]: any } = {};


    constructor(
        protected languageStore: LanguageStore,
        protected listStore: ListViewStore,
        protected pipelineBySalesStageListDataSource: PipelineBySalesStage
    ) {
        this.dataSourceMap[this.pipelineBySalesStageListDataSource.key] = this.pipelineBySalesStageListDataSource;
    }

    ngOnInit(): void {
        const chartTypes = this.listStore.getChartTypes();

        this.chartKey = chartTypes.key;
        this.dataSource = this.dataSourceMap[this.chartKey];
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
}
