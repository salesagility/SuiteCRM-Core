import {Injectable} from '@angular/core';
import {StatisticsMap, StatisticsQueryMap} from '@app-common/statistics/statistics.model';
import {Observable} from 'rxjs';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';

@Injectable({
    providedIn: 'root',
})
export class StatisticsBatch {

    constructor(protected fetchGQL: StatisticsFetchGQL) {
    }

    /**
     * Get statistics
     *
     * @param {string} module to use
     * @param {object} queries StatisticsQueryMap
     * @returns {object} Observable<any>
     */
    public fetch(
        module: string,
        queries: StatisticsQueryMap,
    ): Observable<StatisticsMap> {

        return this.fetchGQL.fetch(module, queries);
    }

}
