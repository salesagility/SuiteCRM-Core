import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {AppState, AppStateStore} from '@store/app-state/app-state.store';
import {Observable} from 'rxjs';
import {StateManager} from '@store/state-manager';
import {SystemConfigStore} from '@store/system-config/system-config.store';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    @ViewChild('mainOutlet', {read: ViewContainerRef, static: true})
    mainOutlet: ViewContainerRef | undefined;
    appState$: Observable<AppState> = this.appStateStore.vm$;

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
