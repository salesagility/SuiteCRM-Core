import {Injectable} from '@angular/core';
import {AppStateStore} from '@store/app-state/app-state.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {StateStore, StateStoreMap, StateStoreMapEntry} from '@base/store/state';
import {MetadataStore} from '@store/metadata/metadata.store.service';

@Injectable({
    providedIn: 'root',
})
export class StateManager {
    protected stateStores: StateStoreMap = {};

    constructor(
        protected appStore: AppStateStore,
        protected languageStore: LanguageStore,
        protected metadataStore: MetadataStore,
        protected navigationStore: NavigationStore,
        protected systemConfigStore: SystemConfigStore,
        protected themeImagesStore: ThemeImagesStore,
        protected userPreferenceStore: UserPreferenceStore,
    ) {
        this.stateStores.appStore = this.buildMapEntry(appStore, false);
        this.stateStores.navigationStore = this.buildMapEntry(navigationStore, true);
        this.stateStores.languageStore = this.buildMapEntry(languageStore, true);
        this.stateStores.metadataStore = this.buildMapEntry(metadataStore, false);
        this.stateStores.systemConfigStore = this.buildMapEntry(systemConfigStore, false);
        this.stateStores.themeImagesStore = this.buildMapEntry(themeImagesStore, false);
        this.stateStores.userPreferenceStore = this.buildMapEntry(userPreferenceStore, true);
    }

    /**
     * Public Api
     */

    /**
     * Clear all state
     */
    public clear(): void {
        Object.keys(this.stateStores).forEach((key) => {
            this.stateStores[key].store.clear();
        });
    }

    /**
     * Clear all state
     */
    public clearAuthBased(): void {
        Object.keys(this.stateStores).forEach((key) => {
            if (this.stateStores[key].authBased) {
                this.stateStores[key].store.clearAuthBased();
            }
        });
    }

    /**
     * Internal api
     */

    /**
     * Build Map entry
     *
     * @param {{}} store to use
     * @param {boolean} authBased flag
     * @returns {{}} StateStoreMapEntry
     */
    protected buildMapEntry(store: StateStore, authBased: boolean): StateStoreMapEntry {
        return {
            store,
            authBased
        };
    }
}
