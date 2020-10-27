import {SingleValueStatisticsStoreFactory} from '@store/single-value-statistics/single-value-statistics.store.factory';
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

        if (queries.opportunities) {
            return of({
                history: {
                    id: 'opportunities',
                    data: {
                        value: '5400'
                    },
                    metadata: {
                        dataType: 'currency',
                        type: 'single-value-statistic'
                    }
                }
            }).pipe(shareReplay(1));
        }

        if (queries['accounts-won-opportunity-amount-by-year']) {
            return of({
                history: {
                    id: 'accounts-won-opportunity-amount-by-year',
                    data: {
                        value: '1466.6666666666667'
                    },
                    metadata: {
                        dataType: 'currency',
                        type: 'single-value-statistic'
                    }
                }
            }).pipe(shareReplay(1));
        }

    }
}

export const topWidgetStatisticsFactoryMock = new SingleValueStatisticsStoreFactory(
    new StatisticsFetchGQLSpy(),
);
