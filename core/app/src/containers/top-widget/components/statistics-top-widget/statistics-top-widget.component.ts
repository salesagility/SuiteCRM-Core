import {Component, OnInit} from '@angular/core';
import {BaseWidgetComponent} from '@containers/top-widget/top-widget.model';
import {
    SingleValueStatisticsState,
    SingleValueStatisticsStore
} from '@store/single-value-statistics/single-value-statistics.store';
import {SingleValueStatisticsStoreFactory} from '@store/single-value-statistics/single-value-statistics.store.factory';
import {map, take} from 'rxjs/operators';
import {LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {combineLatest, Observable} from 'rxjs';
import {StatisticsQuery} from '@app-common/statistics/statistics.model';

interface StatisticsTopWidgetState {
    statistics: { [key: string]: SingleValueStatisticsState };
    appStrings: LanguageStringMap;
}

interface StatisticsEntry {
    labelKey: string;
    type: string;
    store: SingleValueStatisticsStore;
}

interface StatisticsEntryMap {
    [key: string]: StatisticsEntry;
}

@Component({
    selector: 'scrm-statistics-top-widget',
    templateUrl: './statistics-top-widget.component.html',
    styles: []
})
export class StatisticsTopWidgetComponent extends BaseWidgetComponent implements OnInit {
    statistics: StatisticsEntryMap = {};
    vm$: Observable<StatisticsTopWidgetState>;
    messageLabelKey: string;

    constructor(
        protected language: LanguageStore,
        protected factory: SingleValueStatisticsStoreFactory
    ) {
        super();
    }


    ngOnInit(): void {


        if (!this.context || !this.context.module) {
            this.messageLabelKey = 'LBL_BAD_CONFIG_BAD_CONTEXT';
            return;
        }

        if (!this.config) {
            this.messageLabelKey = 'LBL_BAD_CONFIG_NO_CONFIG';
            return;
        }

        if (!this.config.options || !this.config.options.statistics || !this.config.options.statistics.length) {
            this.messageLabelKey = 'LBL_BAD_CONFIG_NO_STATISTICS_KEY';
            return;
        }

        const statistics$: Observable<SingleValueStatisticsState>[] = [];
        this.config.options.statistics.forEach(statistic => {

            if (!statistic.type) {
                return;
            }

            this.statistics[statistic.type] = {
                labelKey: statistic.labelKey || '',
                type: statistic.type,
                store: this.factory.create()
            };

            this.statistics[statistic.type].store.init(
                this.context.module,
                {
                    key: statistic.type,
                    context: {...this.context}
                } as StatisticsQuery,
            ).pipe(take(1)).subscribe();

            statistics$.push(this.statistics[statistic.type].store.state$);
        });


        this.vm$ = combineLatest([combineLatest(statistics$), this.language.appStrings$]).pipe(
            map(([statistics, appStrings]) => {
                const statsMap: { [key: string]: SingleValueStatisticsState } = {};
                statistics.forEach(value => {
                    statsMap[value.statistic.id] = value;
                });

                return {
                    statistics: statsMap,
                    appStrings
                };
            })
        );


    }

}
