import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {deepClone} from '@base/app-common/utils/object-utils';
import {SeriesStatistic, StatisticsQuery} from '@app-common/statistics/statistics.model';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {StatisticsStore} from '@store/statistics/statistics.store';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {SeriesResult} from '@app-common/containers/chart/chart.model';
import {StatisticsState} from '@app-common/statistics/statistics-store.model';

const initialState = {
    module: '',
    query: {} as StatisticsQuery,
    statistic: {
        id: '',
        data: {} as SeriesResult
    } as SeriesStatistic,
    loading: false
} as SeriesStatisticsState;

export interface SeriesStatisticsState extends StatisticsState {
    statistic: SeriesStatistic;
}

@Injectable()
export class SeriesStatisticsStore extends StatisticsStore {
    state$: Observable<SeriesStatisticsState>;
    statistic$: Observable<SeriesStatistic>;
    protected cache$: Observable<any> = null;
    protected internalState: SeriesStatisticsState = deepClone(initialState);
    protected store = new BehaviorSubject<SeriesStatisticsState>(this.internalState);

    constructor(
        protected fetchGQL: StatisticsFetchGQL,
    ) {
        super(fetchGQL);
        this.state$ = this.store.asObservable();
        this.statistic$ = this.state$.pipe(map(state => state.statistic), distinctUntilChanged());
    }

    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: SeriesStatisticsState): void {
        super.updateState(state);
    }
}
