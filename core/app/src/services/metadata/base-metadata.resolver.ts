import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {concatAll, map, toArray} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';

import {SystemConfigFacade} from '@base/facades/system-config/system-config.facade';
import {LanguageFacade} from '@base/facades/language/language.facade';
import {NavigationFacade} from '@base/facades/navigation/navigation.facade';
import {UserPreferenceFacade} from '@base/facades/user-preference/user-preference.facade';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';


@Injectable({providedIn: 'root'})
export class BaseMetadataResolver implements Resolve<any> {

    constructor(private systemConfigFacade: SystemConfigFacade,
                private languageFacade: LanguageFacade,
                private navigationFacade: NavigationFacade,
                private userPreferenceFacade: UserPreferenceFacade,
                private themeImagesFacade: ThemeImagesFacade) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const streams$: { [key: string]: Observable<any> } = {};

        if (this.isToLoadNavigation(route)) {
            streams$.navigation = this.navigationFacade.load();
        }

        if (this.isToLoadConfigs(route)) {

            let configs$ = this.systemConfigFacade.load();

            if (this.isToLoadLanguageStrings(route)) {
                const langStrings = this.getLanguagesToLoad(route);

                configs$ = configs$.pipe(
                    map(
                        configs => {

                            let language = configs.default_language.value;

                            if (this.languageFacade.hasLanguageChanged()) {
                                language = this.languageFacade.getCurrentLanguage();
                            }

                            return this.languageFacade.load(language, langStrings);
                        },
                    ),
                    concatAll(),
                    toArray()
                );
            }

            streams$.configs = configs$;
        }

        if (this.isToLoadUserPreferences(route)) {

            streams$.preferences = this.userPreferenceFacade.load();
        }


        const parallelStream$ = forkJoin(streams$);

        return parallelStream$.pipe(
            map((data: any) => {

                let theme = null;

                if (this.systemConfigFacade.getConfigValue('default_theme')) {
                    theme = this.systemConfigFacade.getConfigValue('default_theme');
                }

                if (this.userPreferenceFacade.getUserPreference('user_theme')) {
                    theme = this.userPreferenceFacade.getUserPreference('user_theme');
                }

                if (this.themeImagesFacade.getTheme()) {
                    theme = this.themeImagesFacade.getTheme();
                }

                if (theme !== null) {
                    return this.themeImagesFacade.load(theme);
                }

                return data;
            }),
            concatAll(),
            toArray()
        );
    }

    /**
     * Get Languages to Load
     *
     * @param route
     */
    protected getLanguagesToLoad(route: ActivatedRouteSnapshot): string[] {
        let langStrings: string[] = this.languageFacade.getAvailableStringsTypes();

        if (this.isToLoadNavigation(route)) {
            return langStrings;
        }

        if (!route.data || !route.data.load) {
            return [];
        }

        if (Array.isArray(route.data.load.languageStrings)) {
            langStrings = route.data.load.languageStrings;
        }

        return langStrings;
    }

    /**
     * Should load language strings. True if navigation is to load
     *
     * @param route
     * @returns boolean
     */
    protected isToLoadLanguageStrings(route: ActivatedRouteSnapshot): boolean {

        if (this.isToLoadNavigation(route)) {
            return true;
        }

        if (!route.data || !route.data.load) {
            return false;
        }

        return Array.isArray(route.data.load.languageStrings) || route.data.load.languageStrings === true;
    }

    /**
     * Should load navigation. If not set defaults to true
     *
     * @param route
     * @returns boolean
     */
    protected isToLoadConfigs(route: ActivatedRouteSnapshot): boolean {
        if (!route.data || !route.data.load) {
            return true;
        }

        return route.data.load.configs !== false;
    }

    /**
     * Should load navigation, If not set defaults to true
     *
     * @param route
     * @returns boolean
     */
    protected isToLoadNavigation(route: ActivatedRouteSnapshot): boolean {
        if (!route.data || !route.data.load) {
            return true;
        }

        return route.data.load.navigation !== false;
    }

    /**
     * Should load user preferences. If not set defaults to true
     *
     * @param route
     * @returns boolean
     */
    protected isToLoadUserPreferences(route: ActivatedRouteSnapshot): boolean {
        if (!route.data || !route.data.load) {
            return true;
        }

        return route.data.load.preferences !== false;
    }
}
