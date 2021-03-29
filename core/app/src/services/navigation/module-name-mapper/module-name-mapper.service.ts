import {Injectable} from '@angular/core';
import {SystemConfigStore} from '@store/system-config/system-config.store';

export interface NameMap {
    [key: string]: string;
}


@Injectable({providedIn: 'root'})
export class ModuleNameMapper {

    constructor(private systemConfig: SystemConfigStore) {
    }

    /**
     * Public Api
     */

    /**
     * Map the legacy name to frontend
     *
     * @param {string} module the module name
     * @returns {string} frontend name
     */
    public toFrontend(module: string): string {
        const map = this.getLegacyToFrontendMap();
        if (!map[module]) {
            return module;
        }

        return map[module];
    }

    /**
     * Map the frontend name to legacy
     *
     * @param {string} module the module name
     * @returns {string} frontend name
     */
    public toLegacy(module: string): string {
        const map = this.getFrontendToLegacyMap();
        if (!map[module]) {
            return module;
        }

        return map[module];
    }

    /**
     * Check if module is valid
     *
     * @param {string} module the module name
     * @returns {boolean} is valid
     */
    public isValid(module: string): boolean {
        const map = this.getFrontendToLegacyMap();
        let valid = false;

        if (map[module]) {
            valid = true;
        }

        return valid;
    }


    /**
     * Internal API
     */

    /**
     * Get the legacy to frontend map
     *
     * @returns {{}} map
     */
    protected getLegacyToFrontendMap(): NameMap {
        return this.systemConfig.getConfigValue('module_name_map');
    }

    /**
     * Get the frontend to legacy map
     *
     * @returns {{}} map
     */
    protected getFrontendToLegacyMap(): NameMap {
        const map = this.systemConfig.getConfigValue('module_name_map');
        const invertedMap = {};

        Object.keys(map).forEach((legacyName) => {
            const frontendName = map[legacyName];
            invertedMap[frontendName] = legacyName;
        });

        return invertedMap;
    }
}
