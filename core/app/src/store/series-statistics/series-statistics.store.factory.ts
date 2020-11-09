import {Injectable} from '@angular/core';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {SeriesStatisticsStore} from '@store/series-statistics/series-statistics.store';

@Injectable({
    providedIn: 'root',
})
export class SeriesStatisticsStoreFactory {

    constructor(protected fetchGQL: StatisticsFetchGQL) {
    }

    create(): SeriesStatisticsStore {
        return new SeriesStatisticsStore(this.fetchGQL);
    }
}
