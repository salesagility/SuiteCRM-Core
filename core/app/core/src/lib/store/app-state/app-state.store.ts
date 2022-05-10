/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {deepClone, isVoid} from 'common';
import {StateStore} from '../state';
import {LoadingBufferFactory} from '../../services/ui/loading-buffer/loading-buffer.factory';
import {LoadingBuffer} from '../../services/ui/loading-buffer/loading-buffer.service';

export interface AppState {
    loading?: boolean;
    initialAppLoading?: boolean;
    module?: string;
    view?: string;
    loaded?: boolean;
    routeUrl?: string;
    activeRequests?: number;
}

const initialState: AppState = {
    loading: false,
    initialAppLoading: true,
    module: null,
    view: null,
    loaded: false,
    routeUrl: null,
    activeRequests: 0
};

let internalState: AppState = deepClone(initialState);

@Injectable({
    providedIn: 'root',
})
export class AppStateStore implements StateStore {

    /**
     * Public long-lived observable streams
     */
    loading$: Observable<boolean>;
    module$: Observable<string>;
    view$: Observable<string>;
    initialAppLoading$: Observable<boolean>;
    activeRequests$: Observable<number>;

    /**
     * ViewModel that resolves once all the data is ready (or updated)...
     */
    vm$: Observable<AppState>;

    protected store = new BehaviorSubject<AppState>(internalState);
    protected state$ = this.store.asObservable();
    protected loadingQueue = {};
    protected loadingBuffer: LoadingBuffer;
    protected subs: Subscription[] = [];

    constructor(protected loadingBufferFactory: LoadingBufferFactory) {

        this.loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
        this.module$ = this.state$.pipe(map(state => state.module), distinctUntilChanged());
        this.view$ = this.state$.pipe(map(state => state.view), distinctUntilChanged());
        this.initialAppLoading$ = this.state$.pipe(map(state => state.initialAppLoading), distinctUntilChanged());
        this.activeRequests$ = this.state$.pipe(map(state => state.activeRequests), distinctUntilChanged());

        this.vm$ = combineLatest([this.loading$, this.module$, this.view$, this.initialAppLoading$]).pipe(
            map(([loading, module, view, initialAppLoading]) => ({
                loading,
                module,
                view,
                loaded: internalState.loaded,
                initialAppLoading
            }))
        );
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
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public clearAuthBased(): void {
    }

    public init(): void {
        this.initLoadingBuffer();
    }

    /**
     * Get number of active requests
     */
    public getActiveRequests(): number {
        return internalState.activeRequests;
    }

    /**
     * Add active request to counter
     */
    public addActiveRequest(): void {
        let activeRequests = internalState.activeRequests;
        if (isVoid(activeRequests)) {
            activeRequests = 0;
        }
        activeRequests++;

        this.updateState({...internalState, activeRequests});
    }

    /**
     * Remove active request to counter
     */
    public removeActiveRequest(): void {
        let activeRequests = internalState.activeRequests;
        if (isVoid(activeRequests)) {
            activeRequests = 0;
        } else {
            activeRequests--;
        }

        if (activeRequests < 0) {
            activeRequests = 0;
        }

        this.updateState({...internalState, activeRequests});
    }

    /**
     * Update loading status for given key
     *
     * @param {string} key to update
     * @param {boolean} loading status to set
     * @param {boolean} delay
     */
    public updateLoading(key: string, loading: boolean, delay = true): void {

        this.initLoadingBuffer();

        if (loading === true) {
            this.addToLoadingQueue(key);

            this.loadingBuffer.updateLoading(loading);
            if (!delay) {
                this.updateState({...internalState, loading});
            }

            return;
        }

        this.removeFromLoadingQueue(key);

        if (this.hasActiveLoading()) {
            this.loadingBuffer.updateLoading(loading);
            this.updateState({...internalState, loading});
        }
    }

    /**
     * Update loading status for given key
     *
     * @param {boolean} initialAppLoading status to set
     */
    public updateInitialAppLoading(initialAppLoading: boolean): void {
        this.updateState({...internalState, initialAppLoading});
    }

    /**
     * Has app been initially loaded
     *
     * @returns {boolean} is loaded
     */
    public isLoaded(): boolean {
        return internalState.loaded;
    }

    /**
     * Set initial app load status
     *
     * @param {string} loaded flag
     */
    public setLoaded(loaded: boolean): void {
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
        return internalState?.module ?? '';
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
     * Set route url
     *
     * @param {string} routeUrl to set
     */
    public setRouteUrl(routeUrl: string): void {
        this.updateState({...internalState, routeUrl});
    }

    /**
     * Get the route ulr
     *
     * @returns {string} current route url
     */
    public getRouteUrl(): string {
        return internalState.routeUrl;
    }

    /**
     * Internal API
     */

    /**
     * Init loading buffer
     * @protected
     */
    protected initLoadingBuffer(): void {
        if (!this.loadingBuffer) {
            this.loadingBuffer = this.loadingBufferFactory.create();
            this.subs.push(this.loadingBuffer.loading$.subscribe((loading) => {
                this.updateState({...internalState, loading});
            }));
        }
    }

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
