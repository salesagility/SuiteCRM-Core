import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Record, ListViewStore} from '@store/list-view/list-view.store';
import {map} from 'rxjs/operators';
import {
    LineChartDataSource,
    LineChartResult
} from '@components/chart/charts/line-chart/line-chart.model';
import {LanguageStore} from '@store/language/language.store';

@Injectable()
export class AnnualRevenueLineChart implements LineChartDataSource {

    key = 'annual_revenue';
    chartType = 'line-chart';
    height = 700;
    scheme = 'picnic';
    xAxis = true;
    yAxis = true;
    gradient = false;
    legend = false;
    showXAxisLabel = false;
    xAxisLabel = '';
    showYAxisLabel = false;
    yAxisLabel = 'Account';

    constructor(protected listStore: ListViewStore) {
    }

    getResults(): Observable<LineChartResult[]> {
        return this.listStore.records$.pipe(map((records: Record[]) => {
            const results: LineChartResult[] = [];

            const group: { [key: string]: LineChartResult } = {};

            if (records) {
                records.forEach(record => {
                    if (record.type !== 'Account') {
                        return;
                    }

                    const name = record.attributes.date_created;
                    const value = record.attributes.type;

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
}
