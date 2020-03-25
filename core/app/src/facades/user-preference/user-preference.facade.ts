import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, distinctUntilChanged, tap, shareReplay} from 'rxjs/operators';

import {CollectionGQL} from '@services/api/graphql-api/api.collection.get';

export interface UserPreference {
    id: string;
    _id: string;
    value: string;
    items: { [key: string]: any };
}

export interface UserPreferenceMap {
    [key: string]: UserPreference;
}

export interface UserPreferences {
    userPreferences: UserPreferenceMap;
    loading: boolean;
}


let internalState: UserPreferences = {
    userPreferences: {},
    loading: false
};

let cache$: Observable<any> = null;

@Injectable({
    providedIn: 'root',
})
export class UserPreferenceFacade {
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
     * @return Observable<any>
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
                        for (const key in edge.node.items) {
                            userPreferences[key] = edge.node.items[key];
                        }
                    });
                }

                return userPreferences;
            }));
    }
}
