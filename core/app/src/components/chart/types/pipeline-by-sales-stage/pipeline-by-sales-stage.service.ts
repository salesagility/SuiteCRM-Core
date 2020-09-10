import {Injectable} from '@angular/core';
import {
    VerticalBarChartDataSource,
    VerticalBarChartResult
} from '@components/chart/charts/vertical-bar-chart/vertical-bar-chart.model';
import {Observable} from 'rxjs';
import {ListViewStore} from '@store/list-view/list-view.store';
import {map} from 'rxjs/operators';
import {LanguageStore} from '@store/language/language.store';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {Record} from '@app-common/record/record.model';

@Injectable()
export class PipelineBySalesStage implements VerticalBarChartDataSource {

    key = 'pipeline_by_sales_state';
    chartType = 'vertical-bar-chart';
    scheme = 'picnic';
    xAxis = false;
    yAxis = true;
    gradient = false;
    legend = true;
    showXAxisLabel = false;
    xAxisLabel = '';
    showYAxisLabel = false;
    yAxisLabel = 'Amount';
    tickFormatting = this.yAxisTickFormatting.bind(this);

    constructor(
        protected listStore: ListViewStore,
        protected languageStore: LanguageStore,
        protected preferences: UserPreferenceStore,
        protected configs: SystemConfigStore
    ) {
    }

    getResults(): Observable<VerticalBarChartResult[]> {
        return this.listStore.records$.pipe(map((records: Record[]) => {
            const results: VerticalBarChartResult[] = [];

            const group: { [key: string]: VerticalBarChartResult } = {};
            const salesStageLabels = this.languageStore.getAppListString('sales_stage_dom');

            if (records) {
                records.forEach(record => {
                    if (record.type !== 'Opportunity') {
                        return;
                    }

                    const name = record.attributes.sales_stage;
                    let value = 0;
                    if (record.attributes.amount) {
                        value = parseInt(record.attributes.amount, 10);
                    }

                    if (!group[name]) {
                        // const label = salesStageLabels[name] || name;
                        group[name] = {name, value};
                        return;
                    }

                    group[name].value += value;
                });
            }

            Object.keys(group).forEach(key => {
                results.push(group[key]);
            });

            return results;
        }));
    }

    yAxisTickFormatting(value: any): string {
        return '$' + value;
    }

    tooltipFormatting(value: any): any {
        return '$' + value;
    }
}
