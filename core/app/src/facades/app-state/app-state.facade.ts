import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
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
    protected loadingQueue = {};

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
        this.loadingQueue = {};
        this.updateState(deepClone(initialState));
    }

    /**
     * Update loading status for given key
     *
     * @param {string} key to update
     * @param {string} loading status to set
     */
    public updateLoading(key: string, loading: boolean): void {

        if (loading === true) {
            this.addToLoadingQueue(key);
            this.updateState({...internalState, loading});
            return;
        }

        this.removeFromLoadingQueue(key);

        if (this.hasActiveLoading()) {
            this.updateState({...internalState, loading});
        }
    }

    /**
     * Internal API
     */

    /**
     *  Check if there are still active loadings
     *
     *  @returns {boolean} active loading
     */
    protected hasActiveLoading(): boolean {
        return Object.keys(this.loadingQueue).length < 1;
    }

    /**
     * Remove key from loading queue
     *
     * @param {string} key to remove
     */
    protected removeFromLoadingQueue(key: string): void {
        if (this.loadingQueue[key]) {
            delete this.loadingQueue[key];
        }
    }

    /**
     * Add key to loading queue
     *
     * @param {string} key to add
     */
    protected addToLoadingQueue(key: string): void {
        this.loadingQueue[key] = true;
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
