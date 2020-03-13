import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, combineLatest} from 'rxjs';
import {map, distinctUntilChanged} from 'rxjs/operators';

export interface AppState {
    loading: boolean;
}


let internalState: AppState = {
    loading: false
};

@Injectable({
    providedIn: 'root',
})
export class AppStateFacade {

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

    public updateLoading(loading: boolean) {
        this.updateState({...internalState, loading});
    }

    /**
     * Update the state
     * @param state
     */
    protected updateState(state: AppState) {
        this.store.next(internalState = state);
    }
}