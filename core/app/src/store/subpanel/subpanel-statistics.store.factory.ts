import {Injectable} from '@angular/core';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {SubpanelStatisticsStore} from '@store/subpanel/subpanel-statistics.store';

@Injectable({
    providedIn: 'root',
})
export class SubpanelStatisticsStoreFactory {

    constructor(protected fetchGQL: StatisticsFetchGQL) {
    }

    create(): SubpanelStatisticsStore {
        return new SubpanelStatisticsStore(this.fetchGQL);
    }
}
