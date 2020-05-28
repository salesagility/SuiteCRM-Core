import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, combineLatest} from 'rxjs';
import {map, distinctUntilChanged} from 'rxjs/operators';
import {deepClone} from '@base/utils/object-utils';
import {StateFacade} from '@base/store/state';

export interface AppState {
    loading: boolean;
    module: string;
    view: string;
    loaded: boolean;
}

const initialState: AppState = {
    loading: false,
    module: null,
    view: null,
    loaded: false
};

let internalState: AppState = deepClone(initialState);

@Injectable({
    providedIn: 'root',
})
export class AppStateFacade implements StateFacade {

    protected store = new BehaviorSubject<AppState>(internalState);
    protected state$ = this.store.asObservable();
    protected loadingQueue = {};

    /**
     * Public long-lived observable streams
     */

    loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
    module$ = this.state$.pipe(map(state => state.module), distinctUntilChanged());
    view$ = this.state$.pipe(map(state => state.view), distinctUntilChanged());

    /**
     * ViewModel that resolves once all the data is ready (or updated)...
     */
    vm$: Observable<AppState> = combineLatest([this.loading$, this.module$, this.view$]).pipe(
        map(([loading, module, view]) => ({loading, module, view, loaded: internalState.loaded}))
    );

    constructor() {
        this.updateState({...internalState, loading: false});
    }

    /**
     * Public Api
     */

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
     * Has app been initially loaded
     *
     * @returns {boolean} is loaded
     */
    public isLoaded(): boolean{
        return internalState.loaded;
    }

    /**
     * Set initial app load status
     *
     * @param {string} loaded flag
     */
    public setLoaded(loaded: boolean): void{
        this.updateState({...internalState, loaded});
    }

    /**
     * Set current module
     *
     * @param {string} module to set as current module
     */
    public setModule(module: string): void {
        this.updateState({...internalState, module});
    }

    /**
     * Get the current module
     *
     * @returns {string} current view
     */
    public getModule(): string {
        return internalState.module;
    }

    /**
     * Set current View
     *
     * @param {string} view to set as current view
     */
    public setView(view: string): void {
        this.updateState({...internalState, view});
    }

    /**
     * Get the current view
     *
     * @returns {string} current view
     */
    public getView(): string {
        return internalState.view;
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
     * @param {{}} state app state
     */
    protected updateState(state: AppState): void {
        this.store.next(internalState = state);
    }
}
