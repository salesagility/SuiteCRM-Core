import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {Statistic, StatisticsMap, StatisticsQueryMap} from '@app-common/statistics/statistics.model';
import {map} from 'rxjs/operators';
import {ApolloQueryResult} from '@apollo/client/core';

@Injectable({
    providedIn: 'root'
})
export class StatisticsFetchGQL {

    constructor(private apollo: Apollo) {
    }

    /**
     * Fetch statistics data from backend
     *
     * @param {string} module name
     * @param {object} queries to use
     * @returns {object} Observable<ApolloQueryResult<any>>
     */
    public fetch(
        module: string,
        queries: StatisticsQueryMap,
    ): Observable<StatisticsMap> {

        const queryOptions = {
            query: gql`
            query getBatchedStatistics($module: String!, $queries: Iterable!){
              getBatchedStatistics(module: $module, queries: $queries) {
                  _id
                  id
                  items
              }
            }
        `,
            variables: {
                module,
                queries,
            },
        };

        return this.apollo.query(queryOptions).pipe(map((result: ApolloQueryResult<any>) => {

            const statistics: StatisticsMap = {};
            const response = (result.data && result.data.getBatchedStatistics) || {} as any;
            const items = response.items || {} as any;
            const itemKeys = Object.keys(items);

            if (itemKeys && itemKeys.length) {
                itemKeys.forEach((itemKey: string) => {
                    const item = items[itemKey];
                    // eslint-disable-next-line no-underscore-dangle
                    const key = itemKey || item._id;
                    statistics[key] = {
                        // eslint-disable-next-line no-underscore-dangle
                        id: item._id,
                        data: item.data,
                        metadata: item.metadata
                    } as Statistic;
                });
            }
            return statistics;
        }));
    }
}
