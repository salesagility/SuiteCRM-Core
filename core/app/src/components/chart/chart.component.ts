import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {ChartTypesMap} from '@store/metadata/metadata.store.service';
import {LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {ListViewStore} from '@store/list-view/list-view.store';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';
import {PipelineBySalesStage} from '@components/chart/types/pipeline-by-sales-stage/pipeline-by-sales-stage.service';
import {AccountTypesPerMonthLineChart} from '@components/chart/types/account-types-per-month/account-types-per-month.service';
import {LeadsByStatus} from '@components/chart/types/leads-by-status/leads-by-status.service';

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
    providers: [PipelineBySalesStage, AccountTypesPerMonthLineChart, LeadsByStatus]
})
export class ChartUiComponent {
    type = '';
    chartKey = '';
    chartLabel = '';
    dataSource;
    private dataSourceMap: { [key: string]: any } = {};


    constructor(
        protected languageStore: LanguageStore,
        protected listStore: ListViewStore,
        protected pipelineBySalesStage: PipelineBySalesStage,
        protected accountTypesPerMonth: AccountTypesPerMonthLineChart,
        protected leadsByStatus: LeadsByStatus
    ) {
        this.dataSourceMap[this.pipelineBySalesStage.key] = this.pipelineBySalesStage;
        this.dataSourceMap[this.accountTypesPerMonth.key] = this.accountTypesPerMonth;
        this.dataSourceMap[this.leadsByStatus.key] = this.leadsByStatus;

    }

    ngOnInit(): void {
        const chartTypes = this.listStore.getChartTypes();
        if (chartTypes) {
            this.chartKey = chartTypes.key;
            this.dataSource = this.dataSourceMap[this.chartKey];
            this.type = chartTypes.type;
            this.chartLabel = this.languageStore.getAppString(chartTypes.labelKey);
        }
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
