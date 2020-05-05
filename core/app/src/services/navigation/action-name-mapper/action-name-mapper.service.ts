import {Injectable} from '@angular/core';
import {SystemConfigFacade} from '@base/facades/system-config/system-config.facade';

export interface NameMap {
    [key: string]: string;
}


@Injectable({providedIn: 'root'})
export class ActionNameMapper {

    constructor(private systemConfig: SystemConfigFacade) {
    }

    /**
     * Public Api
     */

    /**
     * Map the legacy name to frontend
     *
     * @param {string} action the action name
     * @returns {string} frontend name
     */
    public toFrontend(action: string): string {
        const map = this.getLegacyToFrontendMap();

        if (!map[action]){
            return action;
        }

        return map[action];
    }

    /**
     * Map the frontend name to legacy
     *
     * @param {string} action the action name
     * @returns {string} frontend name
     */
    public toLegacy(action: string): string {
        const map = this.getFrontendToLegacyMap();

        if (!map[action]){
            return action;
        }

        return map[action];
    }

    /**
     * Check if action is valid
     *
     * @param {string} action the action name
     * @returns {boolean} is valid
     */
    public isValid(action: string): boolean {
        const map = this.getFrontendToLegacyMap();
        let valid = false;

        if (map[action]) {
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
     * @returns {{}} legacy to frontend map
     */
    protected getLegacyToFrontendMap(): NameMap {
        return this.systemConfig.getConfigValue('action_name_map');
    }

    /**
     * Get the frontend to legacy map
     *
     * @returns {{}} frontend to legacy map
     */
    protected getFrontendToLegacyMap(): NameMap {
        const map = this.systemConfig.getConfigValue('action_name_map');
        const invertedMap = {};

        Object.keys(map).forEach((legacyName) => {
            const frontendName = map[legacyName];
            invertedMap[frontendName] = legacyName;
        });

        return invertedMap;
    }
}
