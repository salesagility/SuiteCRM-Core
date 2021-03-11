import {Observable} from 'rxjs';
import {SingleValueStatistic, Statistic, StatisticsQuery} from '@app-common/statistics/statistics.model';
import {ViewContext} from '@app-common/views/view.model';
import {Field} from '@app-common/record/field.model';

export interface StatisticsState {
    module: string;
    query: StatisticsQuery;
    statistic: Statistic;
    loading: boolean;
}

export interface SingleValueStatisticsState extends StatisticsState {
    statistic: SingleValueStatistic;
    field?: Field;
}

export interface SingleValueStatisticsStoreInterface {
    state$: Observable<SingleValueStatisticsState>;
    statistic$: Observable<Statistic>;
    loading$: Observable<boolean>;
    context: ViewContext;

    clear(): void;

    clearAuthBased(): void;

    /**
     * Get Statistic query
     *
     * @returns {object} StatisticsQuery
     */
    getQuery(): StatisticsQuery;

    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @param {object} query to use
     * @param {boolean} load if to load
     * @returns {object} Observable<any>
     */
    init(module: string, query: StatisticsQuery, load?: boolean): Observable<Statistic>;

    /**
     * Load / reload statistics
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    load(useCache?: boolean): Observable<Statistic>;

    /**
     * Set loading
     *
     * @param {boolean} loading bool
     */
    setLoading(loading: boolean): void;

    /**
     * Set Statistic value
     *
     * @param {string} key string
     * @param {object} statistic Statistic
     * @param {boolean} cache bool
     */
    setStatistic(key: string, statistic: Statistic, cache?: boolean): void;
}
