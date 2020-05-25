import {UserPreferenceFacade, UserPreferenceMap} from '@store/user-preference/user-preference.facade';
import {BaseFieldComponent} from './base-field.component';
import {SystemConfigFacade, SystemConfigMap} from '@store/system-config/system-config.facade';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';

export class BaseNumberComponent extends BaseFieldComponent {

    preferences$ = this.userPreferences.userPreferences$;
    configs$ = this.systemConfig.configs$;
    vm$ = combineLatest([this.configs$, this.preferences$]).pipe(
        map(([configs, preferences]) => ({
            configs,
            preferences,
        }))
    );

    constructor(
        protected userPreferences: UserPreferenceFacade,
        protected systemConfig: SystemConfigFacade
    ) {
        super();
    }

    get format(): boolean {
        if (!this.metadata) {
            return true;
        }

        return this.metadata.format !== false;
    }

    getGroupSymbol(preferences: UserPreferenceMap, configs: SystemConfigMap): string {

        if (preferences && preferences.num_grp_sep) {
            return preferences.num_grp_sep;
        }

        if (configs && configs.default_number_grouping_seperator) {
            return configs.default_number_grouping_seperator.value;
        }

        return ',';
    }

    getDecimalsSymbol(preferences: UserPreferenceMap, configs: SystemConfigMap): string {

        if (preferences && preferences.dec_sep) {
            return preferences.dec_sep;
        }

        if (configs && configs.default_decimal_seperator) {
            return configs.default_decimal_seperator.value;
        }

        return '.';
    }
}
