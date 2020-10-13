import {SubpanelStatisticsStoreFactory} from '@store/subpanel/subpanel-statistics.store.factory';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {StatisticsMap, StatisticsQueryMap} from '@app-common/statistics/statistics.model';
import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';

class StatisticsFetchGQLSpy extends StatisticsFetchGQL {
    constructor() {
        super(null);
    }

    public fetch(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        module: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        queries: StatisticsQueryMap,
    ): Observable<StatisticsMap> {
        return of({
            history: {
                id: 'history',
                data: {
                    type: 'date',
                    value: '2020-09-23'
                }
            }
        }).pipe(shareReplay(1));
    }
}

export const subpanelStatisticsFactoryMock = new SubpanelStatisticsStoreFactory(
    new StatisticsFetchGQLSpy(),
);
