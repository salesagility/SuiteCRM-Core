import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {concatAll, map, tap, toArray} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';

import {SystemConfigStore} from '@store/system-config/system-config.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {AppStateStore} from '@store/app-state/app-state.store';


@Injectable({providedIn: 'root'})
export class BaseMetadataResolver implements Resolve<any> {

    constructor(
        protected systemConfigStore: SystemConfigStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected userPreferenceStore: UserPreferenceStore,
        protected themeImagesStore: ThemeImagesStore,
        protected appState: AppStateStore
    ) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const streams$: { [key: string]: Observable<any> } = {};

        if (this.isToLoadNavigation(route)) {
            streams$.navigation = this.navigationStore.load();
        }

        if (this.isToLoadConfigs(route)) {

            let configs$ = this.systemConfigStore.load();

            if (this.isToLoadLanguageStrings(route)) {
                const langStrings = this.getLanguagesToLoad(route);

                configs$ = configs$.pipe(
                    map(
                        (configs: any) => {

                            let language = configs.default_language.value;

                            if (this.languageStore.hasLanguageChanged()) {
                                language = this.languageStore.getCurrentLanguage();
                            }

                            return this.languageStore.load(language, langStrings);
                        },
                    ),
                    concatAll(),
                    toArray()
                );
            }

            streams$.configs = configs$;
        }

        if (this.isToLoadUserPreferences(route)) {

            streams$.preferences = this.userPreferenceStore.load();
        }


        const parallelStream$ = forkJoin(streams$);

        return parallelStream$.pipe(
            map((data: any) => {

                let theme = null;

                if (this.systemConfigStore.getConfigValue('default_theme')) {
                    theme = this.systemConfigStore.getConfigValue('default_theme');
                }

                if (this.userPreferenceStore.getUserPreference('user_theme')) {
                    theme = this.userPreferenceStore.getUserPreference('user_theme');
                }

                if (this.themeImagesStore.getTheme()) {
                    theme = this.themeImagesStore.getTheme();
                }

                if (theme !== null) {
                    return this.themeImagesStore.load(theme);
                }

                return data;
            }),
            concatAll(),
            toArray(),
            tap(() => this.appState.setLoaded(true))
        );
    }

    /**
     * Get Languages to Load
     *
     * @param {{}} route activated
     * @returns {string[]} languages
     */
    protected getLanguagesToLoad(route: ActivatedRouteSnapshot): string[] {
        let langStrings: string[] = this.languageStore.getAvailableStringsTypes();

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
     * @param {{}} route activated
     * @returns {boolean} is to load
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
     * @param {{}} route activated
     * @returns {boolean} is to load
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
     * @param {{}} route activated
     * @returns {boolean} is to load
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
     * @param {{}} route activated
     * @returns {boolean} is to load
     */
    protected isToLoadUserPreferences(route: ActivatedRouteSnapshot): boolean {
        if (!route.data || !route.data.load) {
            return true;
        }

        return route.data.load.preferences !== false;
    }
}
