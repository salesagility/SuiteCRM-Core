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

import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {AppState, AppStateStore, StateManager, SystemConfigStore} from 'core';
import {Observable} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    @ViewChild('mainOutlet', {read: ViewContainerRef, static: true})
    mainOutlet: ViewContainerRef | undefined;
    appState$: Observable<AppState> = this.appStateStore.vm$.pipe(debounceTime(0));

    constructor(
        private router: Router,
        private appStateStore: AppStateStore,
        protected stateManager: StateManager,
        protected systemConfigs: SystemConfigStore
    ) {
        router.events.subscribe((routerEvent: Event) => this.checkRouterEvent(routerEvent));
    }

    protected checkRouterEvent(routerEvent: Event): void {
        if (routerEvent instanceof NavigationStart) {
            this.appStateStore.updateLoading('router-navigation', true);
            this.conditionalCacheReset();

        }

        if (routerEvent instanceof NavigationEnd) {
            // reset scroll on navigation
            window.scrollTo(0, 0);
            this.appStateStore.setRouteUrl(routerEvent.url)
        }


        if (routerEvent instanceof NavigationEnd ||
            routerEvent instanceof NavigationCancel ||
            routerEvent instanceof NavigationError) {
            this.appStateStore.updateLoading('router-navigation', false);
        }
    }

    protected conditionalCacheReset(): void {
        const cacheClearActions = this.systemConfigs.getConfigValue('cache_reset_actions');
        const previousModule = this.appStateStore.getModule();
        const view = this.appStateStore.getView();

        if (!cacheClearActions || !previousModule) {
            return;
        }

        const resetCacheActions: string[] = cacheClearActions[previousModule];

        if (!resetCacheActions || !resetCacheActions.length) {
            return;
        }

        resetCacheActions.some(action => {
            if (action === 'any' || action === view) {
                this.stateManager.clearAuthBased();
                return true;
            }
        });
    }
}
