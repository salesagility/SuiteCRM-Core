import {Injectable} from '@angular/core';
import {AppStateFacade} from '@base/facades/app-state/app-state.facade';
import {LanguageFacade} from '@base/facades/language/language.facade';
import {NavigationFacade} from '@base/facades/navigation/navigation.facade';
import {SystemConfigFacade} from '@base/facades/system-config/system-config.facade';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {UserPreferenceFacade} from '@base/facades/user-preference/user-preference.facade';
import {StateFacadeMap} from '@base/facades/state';

@Injectable({
    providedIn: 'root',
})
export class StateManager {
    protected stateFacades: StateFacadeMap = {};

    constructor(
        protected appFacade: AppStateFacade,
        protected languageFacade: LanguageFacade,
        protected navigationFacade: NavigationFacade,
        protected systemConfigFacade: SystemConfigFacade,
        protected themeImagesFacade: ThemeImagesFacade,
        protected userPreferenceFacade: UserPreferenceFacade
    ) {
        this.stateFacades.appFacade = appFacade;
        this.stateFacades.languageFacade = languageFacade;
        this.stateFacades.navigationFacade = navigationFacade;
        this.stateFacades.systemConfigFacade = systemConfigFacade;
        this.stateFacades.themeImagesFacade = themeImagesFacade;
        this.stateFacades.userPreferenceFacade = userPreferenceFacade;
    }

    /**
     * Public Api
     */

    /**
     * Clear all state
     */
    public clear(): void {
        Object.keys(this.stateFacades).forEach((key) => {
            this.stateFacades[key].clear();
        });
    }
}
