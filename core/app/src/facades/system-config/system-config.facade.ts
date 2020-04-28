import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, tap} from 'rxjs/operators';

import {CollectionGQL} from '@services/api/graphql-api/api.collection.get';
import {deepClone} from '@base/utils/object-utils';
import {StateFacade} from '@base/facades/state';

export interface SystemConfig {
    id: string;
    _id: string;
    value: string;
    items: { [key: string]: any };
}

export interface SystemConfigMap {
    [key: string]: SystemConfig;
}

export interface SystemConfigs {
    configs: SystemConfigMap;
    loading: boolean;
}

const initialState: SystemConfigs = {
    configs: {},
    loading: false
};

let internalState: SystemConfigs = deepClone(initialState);

let cache$: Observable<any> = null;

@Injectable({
    providedIn: 'root',
})
export class SystemConfigFacade implements StateFacade {
    protected store = new BehaviorSubject<SystemConfigs>(internalState);
    protected state$ = this.store.asObservable();
    protected resourceName = 'systemConfigs';
    protected fieldsMetadata = {
        fields: [
            'id',
            '_id',
            'value',
            'items'
        ]
    };

    /**
     * Public long-lived observable streams
     */
    configs$ = this.state$.pipe(map(state => state.configs), distinctUntilChanged());
    loading$ = this.state$.pipe(map(state => state.loading));

    constructor(private collectionGQL: CollectionGQL) {
    }

    /**
     * Public Api
     */

    /**
     * Get system config value by key
     *
     * @param {string} configKey of the config
     * @returns {{}|string} config value
     */
    public getConfigValue(configKey: string): any {
        if (!internalState.configs || !internalState.configs[configKey]) {
            return null;
        }

        if (internalState.configs[configKey].value !== null) {
            return internalState.configs[configKey].value;
        }

        return internalState.configs[configKey].items;
    }

    public getHomePage(): string {

        let defaultModule = 'home';
        const defaultModuleConfig = this.getConfigValue('default_module');

        if (defaultModuleConfig) {
            defaultModule = defaultModuleConfig;
        }

        return defaultModule;
    }

    /**
     * Clear state
     */
    public clear(): void {
        cache$ = null;
        this.updateState(deepClone(initialState));
    }

    /**
     * Initial SystemConfigs load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @returns {Observable<{}>} observable
     */
    public load(): Observable<any> {

        this.updateState({...internalState, loading: true});

        return this.getSystemConfigs().pipe(
            tap(configs => {
                this.updateState({...internalState, configs, loading: false});
            })
        );
    }

    /**
     * Internal API
     */

    /**
     * Update the state
     *
     * @param {{}} state new state
     */
    protected updateState(state: SystemConfigs): void {
        this.store.next(internalState = state);
    }

    /**
     * Get SystemConfigs cached Observable or call the backend
     *
     * @returns {Observable<{}>} observable
     */
    protected getSystemConfigs(): Observable<any> {

        if (cache$ == null) {
            cache$ = this.fetch().pipe(
                shareReplay(1)
            );
        }

        return cache$;
    }

    /**
     * Fetch the App strings from the backend
     *
     * @returns {Observable<{}>} observable
     */
    protected fetch(): Observable<any> {

        return this.collectionGQL
            .fetchAll(this.resourceName, this.fieldsMetadata).pipe(map(({data}) => {
                const configs: SystemConfigMap = {};

                if (data.systemConfigs && data.systemConfigs.edges) {
                    data.systemConfigs.edges.forEach((edge) => {
                        configs[edge.node._id] = edge.node;
                    });
                }

                return configs;
            }));
    }

}
