import {Injectable} from '@angular/core';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {SingleValueStatisticsStore} from '@store/single-value-statistics/single-value-statistics.store';

@Injectable({
    providedIn: 'root',
})
export class SingleValueStatisticsStoreFactory {

    constructor(protected fetchGQL: StatisticsFetchGQL) {
    }

    create(): SingleValueStatisticsStore {
        return new SingleValueStatisticsStore(this.fetchGQL);
    }
}
