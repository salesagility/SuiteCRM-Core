import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {LanguageStore} from '@store/language/language.store';
import {ListViewStore} from '@store/list-view/list-view.store';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';
import {PipelineBySalesStage} from './types/pipeline-by-sales-stage/pipeline-by-sales-stage.service';
import {AccountTypesPerMonthLineChart} from './types/account-types-per-month/account-types-per-month.service';
import {LeadsByStatus} from './types/leads-by-status/leads-by-status.service';
import {AppState, AppStateStore} from '@store/app-state/app-state.store';
import {ChartTypesMap} from '@app-common/containers/chart/chart.model';

export interface ChartTypesDataSource {
    getChartTypes(): Observable<ChartTypesMap>;
}

@Component({
    selector: 'scrm-list-chart',
    templateUrl: './list-chart.component.html',
    styleUrls: [],
    providers: [PipelineBySalesStage, AccountTypesPerMonthLineChart, LeadsByStatus]
})
export class ListChartComponent {
    appState$: Observable<AppState> = this.appStateStore.vm$;
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
        protected leadsByStatus: LeadsByStatus,
        private appStateStore: AppStateStore
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
