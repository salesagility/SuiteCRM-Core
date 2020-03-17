import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, distinctUntilChanged, tap, shareReplay} from 'rxjs/operators';

import {CollectionGQL} from '../../api/graphql-api/api.collection.get';

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


let internalState: SystemConfigs = {
    configs: {},
    loading: false
};

let cache$: Observable<any> = null;

@Injectable({
    providedIn: 'root',
})
export class SystemConfigFacade {

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
     * Initial SystemConfigs load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @returns Observable<any>
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
     * @param state
     */
    protected updateState(state: SystemConfigs) {
        this.store.next(internalState = state);
    }

    /**
     * Get SystemConfigs cached Observable or call the backend
     *
     * @return Observable<any>
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
     * @returns Observable<any>
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