import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Record, ListViewStore} from '@store/list-view/list-view.store';
import {map} from 'rxjs/operators';
import {
    PieGridChartChartDataSource,
    PieGridChartResult
} from '@components/chart/charts/pie-grid-chart/pie-grid-chart.model';
import {LanguageStore} from '@store/language/language.store';

@Injectable()
export class LeadsByStatus implements PieGridChartChartDataSource {

    key = 'leads_by_status';
    chartType = 'pie-grid-chart';
    height = 700;
    scheme = 'picnic';

    constructor(protected listStore: ListViewStore, protected languageStore: LanguageStore) {
    }

    getResults(): Observable<PieGridChartResult[]> {
        return this.listStore.records$.pipe(map((records: Record[]) => {
            const results: PieGridChartResult[] = [];

            const group: { [key: string]: PieGridChartResult } = {};
            const statusLabels = this.languageStore.getAppListString('lead_status_dom');

            if (records) {
                records.forEach(record => {
                    if (record.type !== 'Lead') {
                        return;
                    }

                    const name = record.attributes.status;

                    if (!group[name]) {

                        // const label = statusLabels[name] || name;
                        group[name] = {name, value: 1};
                        return;
                    }

                    group[name].value++;
                });
            }

            Object.keys(group).forEach(key => {
                results.push(group[key]);
            });

            return results;
        }));
    }

    getTotalLabel(): string {
        return this.languageStore.getAppString('LBL_TOTAL');
    }
}
