import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ListViewStore} from '@store/list-view/list-view.store';
import {map} from 'rxjs/operators';
import {LanguageStore} from '@store/language/language.store';
import {Record} from '@app-common/record/record.model';
import {ChartDataSource, NumberDataItem, SeriesResult, SingleSeries} from '@app-common/containers/chart/chart.model';

@Injectable()
export class LeadsByStatus implements ChartDataSource {

    key = 'leads_by_status';
    chartType = 'pie-grid-chart';
    options = {
        label: ''
    };


    constructor(protected listStore: ListViewStore, protected languageStore: LanguageStore) {
        this.options.label = this.getTotalLabel();
    }

    getResults(): Observable<SeriesResult> {
        return this.listStore.records$.pipe(map((records: Record[]) => {
            const results: SingleSeries = [];

            const group: { [key: string]: NumberDataItem } = {};
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

            return {
                singleSeries: results
            };
        }));
    }

    getTotalLabel(): string {
        return this.languageStore.getAppString('LBL_TOTAL');
    }

    tooltipFormatting(value: any): any {
        return value;
    }
}
