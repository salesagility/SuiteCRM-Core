import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, combineLatest} from 'rxjs';
import {map, distinctUntilChanged, tap} from 'rxjs/operators';

import {CollectionGQL} from '../../api/graphql-api/api.collection.get';

export interface SystemConfig {
    id: string;
    _id: string;
    value: string;
    items: {};
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

    configs$ = this.state$.pipe(map(state => state.configs), distinctUntilChanged());
    loading$ = this.state$.pipe(map(state => state.loading));

    /**
     * ViewModel that resolves once all the data is ready (or updated)...
     */
    vm$: Observable<SystemConfigs> = combineLatest([this.configs$, this.loading$]).pipe(
        map(([configs, loading]) => ({configs, loading}))
    );

    constructor(private collectionGQL: CollectionGQL) {

    }

    /**
     * Initial systemConfigs. Returns observable to be used in resolver if needed
     * @return Observable<any>
     */
    public load(): Observable<any> {
        this.updateState({...internalState, loading: true});
        const configs$ = this.fetch();
        return configs$.pipe(tap(configs => {
            this.updateState({...internalState, configs, loading: false});
        }));
    }

    /**
     * Update the state
     * @param state
     */
    protected updateState(state: SystemConfigs) {
        this.store.next(internalState = state);
    }

    /**
     * Fetch the system configs
     * @return Observable<any>
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