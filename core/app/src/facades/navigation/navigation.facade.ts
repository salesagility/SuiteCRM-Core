import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, distinctUntilChanged, tap, shareReplay} from 'rxjs/operators';

import {RecordGQL} from '@services/api/graphql-api/api.record.get';

export interface Navigation {
    tabs: string[];
    groupedTabs: GroupedTab[];
    modules: NavbarModuleMap;
    userActionMenu: UserActionMenu[];
}

export interface NavbarModuleMap {
    [key: string]: NavbarModule;
}

export interface NavbarModule {
    name: string;
    path: string;
    defaultRoute: string;
    labelKey: string;
    menu: ModuleSubMenu[];
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

export interface ModuleSubMenu {
    name: string;
    labelKey: string;
    label?: string;
    url: string;
    params?: string;
    icon: string;
}

let internalState: Navigation = {
    tabs: [],
    groupedTabs: [],
    modules: {},
    userActionMenu: []
};

let cache$: Observable<any> = null;

@Injectable({
    providedIn: 'root',
})
export class NavigationFacade {

    protected store = new BehaviorSubject<Navigation>(internalState);
    protected state$ = this.store.asObservable();
    protected resourceName = 'navbar';
    protected fieldsMetadata = {
        fields: [
            'tabs',
            'groupedTabs',
            'modules',
            'userActionMenu'
        ]
    };

    /**
     * Public long-lived observable streams
     */
    tabs$ = this.state$.pipe(map(state => state.tabs), distinctUntilChanged());
    groupedTabs$ = this.state$.pipe(map(state => state.groupedTabs), distinctUntilChanged());
    modules$ = this.state$.pipe(map(state => state.modules), distinctUntilChanged());
    userActionMenu$ = this.state$.pipe(map(state => state.userActionMenu), distinctUntilChanged());

    constructor(private recordGQL: RecordGQL) {
    }


    /**
     * Public Api
     */


    /**
     * Initial Navigation load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @returns Observable<any>
     */
    public load(): Observable<any> {

        return this.getNavigation().pipe(
            tap(navigation => {
                this.updateState({
                    ...internalState,
                    tabs: navigation.tabs,
                    groupedTabs: navigation.groupedTabs,
                    userActionMenu: navigation.userActionMenu,
                    modules: navigation.modules
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
     * @param state
     */
    protected updateState(state: Navigation) {
        this.store.next(internalState = state);
    }

    /**
     * Get Navigation cached Observable or call the backend
     *
     * @return Observable<any>
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
     * @returns Observable<any>
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
                            modules: data.navbar.modules
                        };

                    }

                    return navigation;
                })
            );
    }
}
