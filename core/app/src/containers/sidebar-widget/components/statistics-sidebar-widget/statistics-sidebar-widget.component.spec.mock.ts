import {SingleValueStatisticsStoreFactory} from '@store/single-value-statistics/single-value-statistics.store.factory';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {StatisticsMap, StatisticsQueryMap} from '@app-common/statistics/statistics.model';
import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {fieldManagerMock} from '@services/record/field/field.manager.spec.mock';

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

        if (queries['opportunity-size-analysis']) {
            return of({
                'opportunity-size-analysis': {
                    id: 'opportunity-size-analysis',
                    data: {
                        value: '5'
                    },
                    metadata: {
                        dataType: 'int',
                        type: 'single-value-statistic'
                    }
                }
            }).pipe(shareReplay(1));
        }

        if (queries['opportunity-count']) {
            return of({
                history: {
                    id: 'opportunity-count',
                    data: {
                        value: '200'
                    },
                    metadata: {
                        dataType: 'int',
                        type: 'single-value-statistic'
                    }
                }
            }).pipe(shareReplay(1));
        }

    }
}

export const sidebarWidgetStatisticsFactoryMock = new SingleValueStatisticsStoreFactory(
    new StatisticsFetchGQLSpy(),
    fieldManagerMock
);
