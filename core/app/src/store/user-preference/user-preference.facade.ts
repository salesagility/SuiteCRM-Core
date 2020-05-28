import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, distinctUntilChanged, tap, shareReplay} from 'rxjs/operators';

import {CollectionGQL} from '@services/api/graphql-api/api.collection.get';
import {deepClone} from '@base/utils/object-utils';
import {StateFacade} from '@base/store/state';

export interface UserPreferenceMap {
    [key: string]: string;
}

export interface UserPreferences {
    userPreferences: UserPreferenceMap;
    loading: boolean;
}

const initialState: UserPreferences = {
    userPreferences: {},
    loading: false
};

let internalState: UserPreferences = deepClone(initialState);

let cache$: Observable<any> = null;

@Injectable({
    providedIn: 'root',
})
export class UserPreferenceFacade implements StateFacade {
    protected store = new BehaviorSubject<UserPreferences>(internalState);
    protected state$ = this.store.asObservable();
    protected resourceName = 'userPreferences';
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
    userPreferences$ = this.state$.pipe(map(state => state.userPreferences), distinctUntilChanged());
    loading$ = this.state$.pipe(map(state => state.loading));

    constructor(private collectionGQL: CollectionGQL) {
    }

    /**
     * Public Api
     */

    /**
     * Clear state
     */
    public clear(): void {
        cache$ = null;
        this.updateState(deepClone(initialState));
    }

    /**
     * Get user preferences value by key
     *
     * @param key
     */
    public getUserPreference(key: string): string {

        if (!internalState.userPreferences || !internalState.userPreferences[key]) {
            return null;
        }

        return internalState.userPreferences[key];
    }


    /**
     * Initial UserPreferences load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @returns Observable<any>
     */
    public load(): Observable<any> {
        this.updateState({...internalState, loading: true});

        return this.getUserPreferences().pipe(
            tap(userPreferences => {
                this.updateState({...internalState, userPreferences, loading: false});
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
    protected updateState(state: UserPreferences) {
        this.store.next(internalState = state);
    }

    /**
     * Get UserPreferences cached Observable or call the backend
     *
     * @returns Observable<any>
     */
    protected getUserPreferences(): Observable<any> {

        if (cache$ == null) {
            cache$ = this.fetch().pipe(
                shareReplay(1)
            );
        }

        return cache$;
    }

    /**
     * Fetch the User Preferences from the backend
     *
     * @returns Observable<any>
     */
    protected fetch(): Observable<any> {

        return this.collectionGQL
            .fetchAll(this.resourceName, this.fieldsMetadata).pipe(map(({data}) => {
                const userPreferences: UserPreferenceMap = {};

                if (data.userPreferences && data.userPreferences.edges) {
                    data.userPreferences.edges.forEach((edge) => {

                        if (!edge.node.items) {
                            return;
                        }

                        Object.keys(edge.node.items).forEach(key => {
                            userPreferences[key] = edge.node.items[key];
                        });
                    });
                }

                return userPreferences;
            }));
    }
}
