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
                edges {
                  node {
                    _id,
                    data,
                    metadata
                  }
                }
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

            if (result && result.data.getBatchedStatistics && result.data.getBatchedStatistics.edges) {
                result.data.getBatchedStatistics.edges.forEach((edge: any) => {
                    // eslint-disable-next-line no-underscore-dangle
                    const key = edge.node._id;
                    statistics[key] = {
                        // eslint-disable-next-line no-underscore-dangle
                        id: edge.node._id,
                        data: edge.node.data,
                        metadata: edge.node.metadata
                    } as Statistic;
                });
            }
            return statistics;
        }));
    }
}
