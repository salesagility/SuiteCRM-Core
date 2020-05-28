import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ApiService} from '@services/api/api.service';
import {NavbarModel} from './navbar-model';
import {NavbarAbstract} from './navbar.abstract';
import {Navigation, NavigationFacade} from '@base/store/navigation/navigation.facade';
import {UserPreferenceFacade, UserPreferenceMap} from '@base/store/user-preference/user-preference.facade';
import {AuthService} from '@services/auth/auth.service';
import {SystemConfigFacade} from '@base/store/system-config/system-config.facade';
import {AppState, AppStateFacade} from '@base/store/app-state/app-state.facade';
import {LanguageFacade, LanguageStrings,} from '@base/store/language/language.facade';
import {RouteConverter} from "@services/navigation/route-converter/route-converter.service";
import {ModuleNameMapper} from "@services/navigation/module-name-mapper/module-name-mapper.service";
import {ActionNameMapper} from "@services/navigation/action-name-mapper/action-name-mapper.service";
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';

@Component({
    selector: 'scrm-navbar-ui',
    templateUrl: './navbar.component.html',
    styleUrls: []
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
    moduleNameMapper = new ModuleNameMapper(this.systemConfigFacade)
    actionNameMapper = new ActionNameMapper(this.systemConfigFacade)
    routeConverter = new RouteConverter(this.moduleNameMapper, this.actionNameMapper)
    navbar: NavbarModel = new NavbarAbstract(this.routeConverter, this.moduleNavigation);

    languages$: Observable<LanguageStrings> = this.languageFacade.vm$;
    userPreferences$: Observable<UserPreferenceMap> = this.userPreferenceFacade.userPreferences$;
    currentUser$: Observable<any> = this.authService.currentUser$;
    appState$: Observable<AppState> = this.appState.vm$;
    navigation$: Observable<Navigation> = this.navigationFacade.vm$;

    vm$ = combineLatest([
        this.navigation$,
        this.languages$,
        this.userPreferences$,
        this.currentUser$,
        this.appState$
    ]).pipe(
        map(([navigation, languages, userPreferences, currentUser, appState]) => {

            this.navbar.build(
                navigation,
                languages,
                userPreferences,
                currentUser,
                appState
            );

            return {
                navigation, languages, userPreferences, appState
            };
        })
    );

    constructor(protected navigationFacade: NavigationFacade,
                protected languageFacade: LanguageFacade,
                protected api: ApiService,
                protected userPreferenceFacade: UserPreferenceFacade,
                protected systemConfigFacade: SystemConfigFacade,
                protected appState: AppStateFacade,
                private authService: AuthService,
                protected moduleNavigation: ModuleNavigation
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
        return this.systemConfigFacade.getHomePage();
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
}
