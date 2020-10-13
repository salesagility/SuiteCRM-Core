import {Injectable} from '@angular/core';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {StatisticsStore} from '@store/statistics/statistics.store';

@Injectable({
    providedIn: 'root',
})
export class StatisticsStoreFactory {

    constructor(protected fetchGQL: StatisticsFetchGQL) {
    }

    create(): StatisticsStore {
        return new StatisticsStore(this.fetchGQL);
    }
}
