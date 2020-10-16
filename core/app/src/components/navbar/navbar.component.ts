import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ApiService} from '@services/api/api.service';
import {NavbarModel} from './navbar-model';
import {NavbarAbstract} from './navbar.abstract';
import {Navigation, NavigationStore} from '@store/navigation/navigation.store';
import {UserPreferenceMap, UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {AuthService} from '@services/auth/auth.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {AppState, AppStateStore} from '@store/app-state/app-state.store';
import {LanguageStore, LanguageStrings,} from '@store/language/language.store';
import {RouteConverter} from '@services/navigation/route-converter/route-converter.service';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {ActionNameMapper} from '@services/navigation/action-name-mapper/action-name-mapper.service';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {ScreenSize, ScreenSizeObserverService} from '@services/ui/screen-size-observer/screen-size-observer.service';
import {transition, trigger, useAnimation} from '@angular/animations';
import {fadeIn} from 'ng-animate';

@Component({
    selector: 'scrm-navbar-ui',
    templateUrl: './navbar.component.html',
    styleUrls: [],
    animations: [
        trigger('mobileNavFade', [
            transition(':enter', useAnimation(fadeIn, {
                params: {timing: 0.5, delay: 0}
            })),
        ])
    ]
})
export class NavbarUiComponent implements OnInit, OnDestroy {

    protected static instances: NavbarUiComponent[] = [];

    loaded = true;
    isUserLoggedIn: boolean;

    mainNavCollapse = true;
    subNavCollapse = true;
    mobileNavbar = false;
    mobileSubNav = false;
    backLink = false;
    mainNavLink = true;
    submenu: any = [];
    moduleNameMapper = new ModuleNameMapper(this.systemConfigStore);
    actionNameMapper = new ActionNameMapper(this.systemConfigStore);
    routeConverter = new RouteConverter(this.moduleNameMapper, this.actionNameMapper);
    navbar: NavbarModel = new NavbarAbstract(this.routeConverter, this.moduleNavigation);
    maxTabs = 8;
    screen: ScreenSize = ScreenSize.Medium;

    languages$: Observable<LanguageStrings> = this.languageStore.vm$;
    userPreferences$: Observable<UserPreferenceMap> = this.userPreferenceStore.userPreferences$;
    currentUser$: Observable<any> = this.authService.currentUser$;
    appState$: Observable<AppState> = this.appState.vm$;
    navigation$: Observable<Navigation> = this.navigationStore.vm$;

    vm$ = combineLatest([
        this.navigation$,
        this.languages$,
        this.userPreferences$,
        this.currentUser$,
        this.appState$,
        this.screenSize.screenSize$
    ]).pipe(
        map(([navigation, languages, userPreferences, currentUser, appState, screenSize]) => {

            if (screenSize) {
                this.screen = screenSize;
            }

            this.calculateMaxTabs(navigation);

            this.navbar.build(
                navigation,
                languages,
                userPreferences,
                currentUser,
                appState,
                this.maxTabs
            );

            return {
                navigation, languages, userPreferences, appState
            };
        })
    );

    constructor(protected navigationStore: NavigationStore,
                protected languageStore: LanguageStore,
                protected api: ApiService,
                protected userPreferenceStore: UserPreferenceStore,
                protected systemConfigStore: SystemConfigStore,
                protected appState: AppStateStore,
                private authService: AuthService,
                protected moduleNavigation: ModuleNavigation,
                protected screenSize: ScreenSizeObserverService
    ) {
        const navbar = new NavbarAbstract(this.routeConverter, this.moduleNavigation);
        this.setNavbar(navbar);

        NavbarUiComponent.instances.push(this);
    }

    /**
     * Public API
     */

    /**
     * Reset component instance
     */
    static reset(): void {
        NavbarUiComponent.instances.forEach((navbarComponent: NavbarUiComponent) => {
            navbarComponent.loaded = false;
            navbarComponent.navbar = new NavbarAbstract(navbarComponent.routeConverter, navbarComponent.moduleNavigation);
        });
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        const innerWidth = event.target.innerWidth;
        this.mobileNavbar = innerWidth <= 768;
    }

    ngOnInit(): void {
        const navbar = new NavbarAbstract(this.routeConverter, this.moduleNavigation);
        this.setNavbar(navbar);
        this.authService.isUserLoggedIn.subscribe(value => {
            this.isUserLoggedIn = value;
        });

        window.dispatchEvent(new Event('resize'));
    }

    ngOnDestroy(): void {
        this.authService.isUserLoggedIn.unsubscribe();
    }

    /**
     * Change subnavigation
     *
     * @param {{}} event triggered
     * @param {{}} parentNavItem parent
     */
    public changeSubNav(event: Event, parentNavItem): void {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
        this.submenu = parentNavItem.submenu;
    }

    /**
     * Set link flags
     */
    public navBackLink(): void {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
    }

    /**
     * Get home page
     *
     * @returns {string} homepage
     */
    public getHomePage(): string {
        return this.systemConfigStore.getHomePage();
    }

    /**
     * Internal API
     */

    /**
     * Set navbar model
     *
     * @param {{}} navbar model
     */
    protected setNavbar(navbar: NavbarModel): void {
        this.navbar = navbar;
        this.loaded = true;
    }

    /**
     * Check if is loaded
     *
     * @returns {{boolean}} is loaded
     */
    protected isLoaded(): boolean {
        return this.loaded;
    }

    protected calculateMaxTabs(navigation: Navigation): void {
        const sizeMap = this.systemConfigStore.getConfigValue('navigation_tab_limits');
        if (this.screen && sizeMap) {

            let maxTabs = sizeMap[this.screen];
            if (!maxTabs || navigation.maxTabs && navigation.maxTabs < maxTabs) {
                maxTabs = navigation.maxTabs;
            }

            this.maxTabs = maxTabs;
        }
    }
}
