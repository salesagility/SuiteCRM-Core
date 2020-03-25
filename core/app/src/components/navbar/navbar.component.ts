import {Component, OnInit, HostListener} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {NavbarModel} from './navbar-model';
import {NavbarAbstract} from './navbar.abstract';
import {combineLatest, Observable} from 'rxjs';

import {NavbarModuleMap, NavigationFacade, GroupedTab} from '@base/facades/navigation/navigation.facade';
import {LanguageFacade, LanguageListStringMap, LanguageStringMap} from '@base/facades/language/language.facade';

import {UserPreferenceMap, UserPreferenceFacade} from '@base/facades/user-preference/user-preference.facade';

import {map} from 'rxjs/operators';
import { exists } from 'fs';

@Component({
    selector: 'scrm-navbar-ui',
    templateUrl: './navbar.component.html',
    styleUrls: []
})
export class NavbarUiComponent implements OnInit {

    protected static instances: NavbarUiComponent[] = [];

    loaded = true;

    mainNavCollapse = true;
    subItemCollapse = true;
    subNavCollapse = true;
    mobileNavbar = false;
    mobileSubNav = false;
    backLink = false;
    mainNavLink = true;
    parentNavLink = '';
    submenu: any = [];

    navbar: NavbarModel = new NavbarAbstract();

    tabs$: Observable<string[]> = this.navigationFacade.tabs$;
    modules$: Observable<NavbarModuleMap> = this.navigationFacade.modules$;
    appStrings$: Observable<LanguageStringMap> = this.languageFacade.appStrings$;
    modStrings$: Observable<LanguageListStringMap> = this.languageFacade.modStrings$;
    appListStrings$: Observable<LanguageListStringMap> = this.languageFacade.appListStrings$;
    userPreferences$: Observable<UserPreferenceMap> = this.userPreferenceFacade.userPreferences$;
    groupedTabs$: Observable<any> = this.navigationFacade.groupedTabs$;

    vm$ = combineLatest([
        this.tabs$, 
        this.modules$, 
        this.appStrings$, 
        this.appListStrings$, 
        this.modStrings$, 
        this.userPreferences$,
        this.groupedTabs$
    ]).pipe(
        map((
            [
                tabs,
                modules,
                appStrings,
                appListStrings,
                modStrings,
                userPreferences,
                groupedTabs
            ]) => {

            if (tabs && tabs.length > 0 &&
                modules && Object.keys(modules).length > 0 &&
                appStrings && Object.keys(appStrings).length > 0 &&
                modStrings && Object.keys(modStrings).length > 0 &&
                appListStrings && Object.keys(appListStrings).length > 0 && 
                userPreferences['navigation_paradigm'] && userPreferences['navigation_paradigm'].toString() == "m"
            ) {
                this.navbar.resetMenu();
                this.navbar.buildTabMenu(tabs, modules, appStrings, modStrings, appListStrings, this.menuItemThreshold);
            }

            if (tabs && tabs.length > 0 &&
                modules && Object.keys(modules).length > 0 &&
                appStrings && Object.keys(appStrings).length > 0 &&
                modStrings && Object.keys(modStrings).length > 0 &&
                appListStrings && Object.keys(appListStrings).length > 0 && 
                userPreferences['navigation_paradigm'] && userPreferences['navigation_paradigm'].toString() == "gm"
            ) {
                this.navbar.resetMenu();
                this.navbar.buildGroupTabMenu(tabs, modules, appStrings, modStrings, appListStrings, this.menuItemThreshold, groupedTabs);
            }

            return {
                tabs,
                modules,
                appStrings,
                appListStrings,
                modStrings,
                userPreferences,
                groupedTabs
            };
        })
    );

    protected menuItemThreshold = 5;

    constructor(protected navigationFacade: NavigationFacade,
                protected languageFacade: LanguageFacade,
                protected api: ApiService,
                protected userPreferenceFacade: UserPreferenceFacade) {
        const navbar = new NavbarAbstract();
        this.setNavbar(navbar);

        NavbarUiComponent.instances.push(this);
    }

    static reset() {
        NavbarUiComponent.instances.forEach((navbarComponent: NavbarUiComponent) => {
            navbarComponent.loaded = false;
            navbarComponent.navbar = new NavbarAbstract();
        });
    }

    public changeSubNav(event: Event, parentNavItem) {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
        this.submenu = parentNavItem.submenu;
    }

    public navBackLink(event: Event) {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        const innerWidth = event.target.innerWidth;
        if (innerWidth <= 768) {
            this.mobileNavbar = true;
        } else {
            this.mobileNavbar = false;
        }
    }

    ngOnInit(): void {
        const navbar = new NavbarAbstract();
        this.setNavbar(navbar);

        window.dispatchEvent(new Event('resize'));
    }

    protected setNavbar(navbar: NavbarModel) {
        this.navbar = navbar;
        this.loaded = true;
    }

    protected isLoaded() {
        return this.loaded;
    }
}
