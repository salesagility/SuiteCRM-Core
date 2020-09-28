import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, tap} from 'rxjs/operators';

import {EntityGQL} from '@services/api/graphql-api/api.entity.get';
import {StateStore} from '@base/store/state';
import {deepClone} from '@base/utils/object-utils';

export interface Navigation {
    tabs: string[];
    groupedTabs: GroupedTab[];
    modules: NavbarModuleMap;
    userActionMenu: UserActionMenu[];
    maxTabs: number;
}

export interface NavbarModuleMap {
    [key: string]: NavbarModule;
}

export interface NavbarModule {
    name: string;
    path: string;
    defaultRoute: string;
    labelKey: string;
    menu: ModuleAction[];
}

export interface GroupedTab {
    name: string;
    labelKey: string;
    modules: string[];
}

export interface UserActionMenu {
    name: string;
    labelKey: string;
    url: string;
    icon: string;
}

export interface ModuleAction {
    name: string;
    labelKey: string;
    actionLabelKey?: string;
    label?: string;
    url: string;
    params?: string;
    icon: string;
    module?: string;
}

const initialState: Navigation = {
    tabs: [],
    groupedTabs: [],
    modules: {},
    userActionMenu: [],
    maxTabs: 0
};

let internalState: Navigation = deepClone(initialState);

let cache$: Observable<any> = null;

@Injectable({
    providedIn: 'root',
})
export class NavigationStore implements StateStore {

    /**
     * Public long-lived observable streams
     */
    tabs$: Observable<string[]>;
    groupedTabs$: Observable<GroupedTab[]>;
    modules$: Observable<NavbarModuleMap>;
    userActionMenu$: Observable<UserActionMenu[]>;
    maxTabs$: Observable<number>;

    /**
     * ViewModel that resolves once all the data is ready (or updated)...
     */
    vm$: Observable<Navigation>;

    protected store = new BehaviorSubject<Navigation>(internalState);
    protected state$ = this.store.asObservable();
    protected resourceName = 'navbar';
    protected fieldsMetadata = {
        fields: [
            'tabs',
            'groupedTabs',
            'modules',
            'userActionMenu',
            'maxTabs'
        ]
    };

    constructor(private recordGQL: EntityGQL) {

        this.tabs$ = this.state$.pipe(map(state => state.tabs), distinctUntilChanged());
        this.groupedTabs$ = this.state$.pipe(map(state => state.groupedTabs), distinctUntilChanged());
        this.modules$ = this.state$.pipe(map(state => state.modules), distinctUntilChanged());
        this.userActionMenu$ = this.state$.pipe(map(state => state.userActionMenu), distinctUntilChanged());
        this.maxTabs$ = this.state$.pipe(map(state => state.maxTabs), distinctUntilChanged());


        this.vm$ = combineLatest(
            [
                this.tabs$,
                this.groupedTabs$,
                this.modules$,
                this.userActionMenu$,
                this.maxTabs$
            ])
            .pipe(
                map((
                    [
                        tabs,
                        groupedTabs,
                        modules,
                        userActionMenu,
                        maxTabs
                    ]) => ({tabs, groupedTabs, modules, userActionMenu, maxTabs})
                )
            );
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
     * Initial Navigation load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @returns {{}} Observable<any>
     */
    public load(): Observable<any> {

        return this.getNavigation().pipe(
            tap(navigation => {
                this.updateState({
                    ...internalState,
                    tabs: navigation.tabs,
                    groupedTabs: navigation.groupedTabs,
                    userActionMenu: navigation.userActionMenu,
                    modules: navigation.modules,
                    maxTabs: navigation.maxTabs
                });
            })
        );
    }

    /**
     * Internal API
     */

    /**
     * Update the state
     *
     * @param {{}} state to set
     */
    protected updateState(state: Navigation): void {
        this.store.next(internalState = state);
    }

    /**
     * Get Navigation cached Observable or call the backend
     *
     * @returns {{}} Observable<any>
     */
    protected getNavigation(): Observable<any> {

        const user = '1';

        if (cache$ == null) {
            cache$ = this.fetch(user).pipe(
                shareReplay(1)
            );
        }

        return cache$;
    }

    /**
     * Fetch the Navigation from the backend
     *
     * @param {string} userId to use
     * @returns {{}} Observable<any>
     */
    protected fetch(userId: string): Observable<any> {
        return this.recordGQL
            .fetch(this.resourceName, `/api/navbars/${userId}`, this.fieldsMetadata)
            .pipe(
                map(({data}) => {
                    let navigation: Navigation = null;

                    if (data && data.navbar) {
                        navigation = {
                            tabs: data.navbar.tabs,
                            groupedTabs: data.navbar.groupedTabs,
                            userActionMenu: data.navbar.userActionMenu,
                            modules: data.navbar.modules,
                            maxTabs: data.navbar.maxTabs
                        };

                    }

                    return navigation;
                })
            );
    }
}
