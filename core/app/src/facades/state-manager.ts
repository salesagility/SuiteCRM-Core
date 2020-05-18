import {Injectable} from '@angular/core';
import {AppStateFacade} from '@base/facades/app-state/app-state.facade';
import {LanguageFacade} from '@base/facades/language/language.facade';
import {NavigationFacade} from '@base/facades/navigation/navigation.facade';
import {SystemConfigFacade} from '@base/facades/system-config/system-config.facade';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {UserPreferenceFacade} from '@base/facades/user-preference/user-preference.facade';
import {StateFacade, StateFacadeMap, StateFacadeMapEntry} from '@base/facades/state';

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
        this.stateFacades.appFacade = this.buildMapEntry(appFacade, false);
        this.stateFacades.languageFacade = this.buildMapEntry(languageFacade, false)
        this.stateFacades.navigationFacade = this.buildMapEntry(navigationFacade, true);
        this.stateFacades.systemConfigFacade = this.buildMapEntry(systemConfigFacade, false);
        this.stateFacades.themeImagesFacade = this.buildMapEntry(themeImagesFacade, false);
        this.stateFacades.userPreferenceFacade =  this.buildMapEntry(userPreferenceFacade, true);
    }

    /**
     * Public Api
     */

    /**
     * Clear all state
     */
    public clear(): void {
        Object.keys(this.stateFacades).forEach((key) => {
            this.stateFacades[key].facade.clear();
        });
    }

    /**
     * Clear all state
     */
    public clearAuthBased(): void {
        Object.keys(this.stateFacades).forEach((key) => {
            if (this.stateFacades[key].authBased){
                this.stateFacades[key].facade.clear();
            }
        });
    }

    /**
     * Internal api
     */

    /**
     * Build Map entry
     *
     * @param {{}} facade to use
     * @param {boolean} authBased flag
     * @returns {{}} StateFacadeMapEntry
     */
    protected buildMapEntry(facade: StateFacade, authBased: boolean): StateFacadeMapEntry {
        return {
            facade,
            authBased
        };
    }
}
