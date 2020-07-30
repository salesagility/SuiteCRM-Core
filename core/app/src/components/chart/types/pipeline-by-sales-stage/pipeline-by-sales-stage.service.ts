import {Injectable} from '@angular/core';
import {
    VerticalBarChartDataSource,
    VerticalBarChartResult
} from '@components/chart/charts/vertical-bar-chart/vertical-bar-chart.model';
import {Observable} from 'rxjs';
import {ListEntry, ListViewStore} from '@store/list-view/list-view.store';
import {map} from 'rxjs/operators';

@Injectable()
export class PipelineBySalesStage implements VerticalBarChartDataSource {

    key = 'pipeline_by_sales_state';
    chartType = 'vertical-bar-chart';
    scheme = {
        domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };
    xAxis = true;
    yAxis = true;
    gradient = false;
    legend = false;
    showXAxisLabel = false;
    xAxisLabel = '';
    showYAxisLabel = false;
    yAxisLabel = 'Amount';
    tickFormatting = this.yAxisTickFormatting.bind(this);

    constructor(protected listStore: ListViewStore) {
    }

    getResults(): Observable<VerticalBarChartResult[]> {
        return this.listStore.records$.pipe(map((records: ListEntry[]) => {
            const results: VerticalBarChartResult[] = [];

            const group: { [key: string]: VerticalBarChartResult } = {};

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
        return value + ' $';
    }

    tooltipFormatting(value: any): any {
        return value + ' $';
    }
}
