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

import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {NavbarModel} from '../navbar-model';
import {NavbarAbstract} from '../navbar.abstract';
import {transition, trigger, useAnimation} from '@angular/animations';
import {fadeIn} from 'ng-animate';
import {ActionNameMapper} from '../../../services/navigation/action-name-mapper/action-name-mapper.service';
import {SystemConfigStore} from '../../../store/system-config/system-config.store';
import {Navigation, NavigationStore} from '../../../store/navigation/navigation.store';
import {UserPreferenceMap, UserPreferenceStore} from '../../../store/user-preference/user-preference.store';
import {
    ScreenSize,
    ScreenSizeObserverService
} from '../../../services/ui/screen-size-observer/screen-size-observer.service';
import {RouteConverter} from '../../../services/navigation/route-converter/route-converter.service';
import {LanguageStore, LanguageStrings} from '../../../store/language/language.store';
import {ModuleNavigation} from '../../../services/navigation/module-navigation/module-navigation.service';
import {ModuleNameMapper} from '../../../services/navigation/module-name-mapper/module-name-mapper.service';
import {AppState, AppStateStore} from '../../../store/app-state/app-state.store';
import {AuthService} from '../../../services/auth/auth.service';
import {MenuItem} from 'common';

@Component({
    selector: 'scrm-base-navbar',
    templateUrl: './base-navbar.component.html',
    styleUrls: [],
    animations: [
        trigger('mobileNavFade', [
            transition(':enter', useAnimation(fadeIn, {
                params: {timing: 0.5, delay: 0}
            })),
        ])
    ]
})
export class BaseNavbarComponent implements OnInit, OnDestroy {

    protected static instances: BaseNavbarComponent[] = [];

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
    routeConverter = new RouteConverter(this.moduleNameMapper, this.actionNameMapper, this.systemConfigStore);
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
                protected userPreferenceStore: UserPreferenceStore,
                protected systemConfigStore: SystemConfigStore,
                protected appState: AppStateStore,
                protected authService: AuthService,
                protected moduleNavigation: ModuleNavigation,
                protected screenSize: ScreenSizeObserverService
    ) {
        const navbar = new NavbarAbstract(this.routeConverter, this.moduleNavigation);
        this.setNavbar(navbar);

        BaseNavbarComponent.instances.push(this);
    }

    /**
     * Public API
     */

    /**
     * Reset component instance
     */
    static reset(): void {
        BaseNavbarComponent.instances.forEach((navbarComponent: BaseNavbarComponent) => {
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
     * @param {object} event triggered
     * @param {object} items
     */
    public changeSubNav(event: Event, items: MenuItem[]): void {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
        this.submenu = items;
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

    getCloseCallBack(myDrop): Function {
        return () => myDrop.close();
    }
}
