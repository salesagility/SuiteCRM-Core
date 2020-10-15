import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {deepClone} from '@base/utils/object-utils';
import {
    Statistic,
    StatisticsQuery,
    SubpanelStatistic,
    SubpanelStatisticsData
} from '@app-common/statistics/statistics.model';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {StatisticsState, StatisticsStore} from '@store/statistics/statistics.store';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {Field, FieldManager} from '@app-common/record/field.model';

const initialState = {
    module: '',
    query: {} as StatisticsQuery,
    statistic: {
        id: '',
        data: {} as SubpanelStatisticsData
    } as SubpanelStatistic,
    loading: false
} as SubpanelStatisticsState;

export interface SubpanelStatisticsState extends StatisticsState {
    statistic: SubpanelStatistic;
    field?: Field;
}

@Injectable()
export class SubpanelStatisticsStore extends StatisticsStore {
    state$: Observable<SubpanelStatisticsState>;
    statistic$: Observable<Statistic>;
    loading$: Observable<boolean>;
    protected cache$: Observable<any> = null;
    protected internalState: SubpanelStatisticsState = deepClone(initialState);
    protected store = new BehaviorSubject<SubpanelStatisticsState>(this.internalState);

    constructor(
        protected fetchGQL: StatisticsFetchGQL,
    ) {
        super(fetchGQL);
        this.state$ = this.store.asObservable();
        this.statistic$ = this.state$.pipe(map(state => state.statistic), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
    }

    protected addNewState(statistic: Statistic): void {
        const field = FieldManager.buildShallowField(statistic.data.type, statistic.data.value);

        field.metadata = {
            digits: 0
        };

        this.updateState({
            ...this.internalState,
            statistic,
            field,
            loading: false
        });
    }

    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: SubpanelStatisticsState): void {
        super.updateState(state);
    }
}
