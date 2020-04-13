import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, combineLatest} from 'rxjs';
import {map, distinctUntilChanged} from 'rxjs/operators';
import {deepClone} from '@base/utils/object-utils';
import {StateFacade} from '@base/facades/state';

export interface AppState {
    loading: boolean;
}

const initialState: AppState = {
    loading: false
};

let internalState: AppState = deepClone(initialState);

@Injectable({
    providedIn: 'root',
})
export class AppStateFacade implements StateFacade {

    protected store = new BehaviorSubject<AppState>(internalState);
    protected state$ = this.store.asObservable();

    loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());

    /**
     * ViewModel that resolves once all the data is ready (or updated)...
     */
    vm$: Observable<AppState> = combineLatest([this.loading$]).pipe(
        map(([loading]) => ({loading}))
    );

    constructor() {
        this.updateState({...internalState, loading: false});
    }

    /**
     * Clear state
     */
    public clear(): void {
        this.updateState(deepClone(initialState));
    }

    public updateLoading(loading: boolean) {
        this.updateState({...internalState, loading});
    }

    /**
     * Update the state
     *
     * @param state
     */
    protected updateState(state: AppState) {
        this.store.next(internalState = state);
    }
}
