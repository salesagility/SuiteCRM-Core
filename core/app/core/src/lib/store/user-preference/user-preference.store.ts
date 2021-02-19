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
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, tap} from 'rxjs/operators';

import {CollectionGQL} from '../../services/api/graphql-api/api.collection.get';
import {deepClone} from 'common';
import {StateStore} from '../state';

export interface UserPreferenceMap {
    [key: string]: any;
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
export class UserPreferenceStore implements StateStore {
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

    public clearAuthBased(): void {
        this.clear();
    }

    /**
     * Get user preferences value by key
     *
     * @param {string} key to retrieve
     * @returns any users preference
     */
    public getUserPreference(key: string): any {

        if (!internalState.userPreferences || !internalState.userPreferences[key]) {
            return null;
        }

        return internalState.userPreferences[key];
    }


    /**
     * Initial UserPreferences load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @returns {object} Observable<any>
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
     * @param {object} state to set
     */
    protected updateState(state: UserPreferences): void {
        this.store.next(internalState = state);
    }

    /**
     * Get UserPreferences cached Observable or call the backend
     *
     * @returns {object} Observable<any>
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
     * @returns {object} Observable<any>
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
