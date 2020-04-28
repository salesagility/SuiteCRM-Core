import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ApiService} from '@services/api/api.service';
import {NavbarModel} from './navbar-model';
import {NavbarAbstract} from './navbar.abstract';
import {NavbarModuleMap, NavigationFacade} from '@base/facades/navigation/navigation.facade';
import {LanguageFacade, LanguageListStringMap, LanguageStringMap} from '@base/facades/language/language.facade';
import {UserPreferenceFacade, UserPreferenceMap} from '@base/facades/user-preference/user-preference.facade';
import {AuthService} from '@services/auth/auth.service';
import {SystemConfigFacade} from '@base/facades/system-config/system-config.facade';

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
    subItemCollapse = true;
    subNavCollapse = true;
    mobileNavbar = false;
    mobileSubNav = false;
    backLink = false;
    mainNavLink = true;
    submenu: any = [];

    navbar: NavbarModel = new NavbarAbstract();

    tabs$: Observable<string[]> = this.navigationFacade.tabs$;
    modules$: Observable<NavbarModuleMap> = this.navigationFacade.modules$;
    appStrings$: Observable<LanguageStringMap> = this.languageFacade.appStrings$;
    modStrings$: Observable<LanguageListStringMap> = this.languageFacade.modStrings$;
    appListStrings$: Observable<LanguageListStringMap> = this.languageFacade.appListStrings$;
    userPreferences$: Observable<UserPreferenceMap> = this.userPreferenceFacade.userPreferences$;
    groupedTabs$: Observable<any> = this.navigationFacade.groupedTabs$;
    userActionMenu$: Observable<any> = this.navigationFacade.userActionMenu$;
    currentUser$: Observable<any> = this.authService.currentUser$;

    vm$ = combineLatest([
        this.tabs$,
        this.modules$,
        this.appStrings$,
        this.appListStrings$,
        this.modStrings$,
        this.userPreferences$,
        this.groupedTabs$,
        this.userActionMenu$,
        this.currentUser$
    ]).pipe(
        map(([tabs, modules, appStrings, appListStrings, modStrings, userPreferences, groupedTabs, userActionMenu, currentUser]) => {

            this.navbar.build(
                tabs,
                modules,
                appStrings,
                modStrings,
                appListStrings,
                this.menuItemThreshold,
                groupedTabs,
                userPreferences,
                userActionMenu,
                currentUser
            );

            return {
                tabs, modules, appStrings, appListStrings, modStrings, userPreferences, groupedTabs
            };
        })
    );

    protected menuItemThreshold = 5;

    constructor(protected navigationFacade: NavigationFacade,
                protected languageFacade: LanguageFacade,
                protected api: ApiService,
                protected userPreferenceFacade: UserPreferenceFacade,
                protected systemConfigFacade: SystemConfigFacade,
                private authService: AuthService
    ) {
        const navbar = new NavbarAbstract();
        this.setNavbar(navbar);

        NavbarUiComponent.instances.push(this);
    }

    static reset(): void {
        NavbarUiComponent.instances.forEach((navbarComponent: NavbarUiComponent) => {
            navbarComponent.loaded = false;
            navbarComponent.navbar = new NavbarAbstract();
        });
    }

    public changeSubNav(event: Event, parentNavItem): void {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
        this.submenu = parentNavItem.submenu;
    }

    public navBackLink(): void {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        const innerWidth = event.target.innerWidth;
        this.mobileNavbar = innerWidth <= 768;
    }

    ngOnInit(): void {
        const navbar = new NavbarAbstract();
        this.setNavbar(navbar);
        this.authService.isUserLoggedIn.subscribe(value => {
            this.isUserLoggedIn = value;
        });

        window.dispatchEvent(new Event('resize'));
    }

    ngOnDestroy(): void {
        this.authService.isUserLoggedIn.unsubscribe();
    }

    protected setNavbar(navbar: NavbarModel): void {
        this.navbar = navbar;
        this.loaded = true;
    }

    protected isLoaded(): boolean {
        return this.loaded;
    }
}
