import {BaseFieldComponent} from './base-field.component';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserPreferenceMap, UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigMap, SystemConfigStore} from '@store/system-config/system-config.store';

export class BaseDateTimeComponent extends BaseFieldComponent {

    preferences$ = this.userPreferences.userPreferences$;
    configs$ = this.systemConfig.configs$;
    vm$ = combineLatest([this.configs$, this.preferences$]).pipe(
        map(([configs, preferences]) => ({
            configs,
            preferences,
        }))
    );

    constructor(
        protected userPreferences: UserPreferenceStore,
        protected systemConfig: SystemConfigStore
    ) {
        super();
    }

    getDateFormat(preferences: UserPreferenceMap, configs: SystemConfigMap): string {

        if (preferences && preferences.date_format) {
            return preferences.date_format;
        }

        if (configs && configs.date_format) {
            return configs.date_format.value;
        }

        return 'yyyy-mm-dd';
    }

    getTimeFormat(preferences: UserPreferenceMap, configs: SystemConfigMap): string {

        let format = 'HH:mm:ss';

        if (preferences && preferences.time_format) {
            format = preferences.time_format;

        } else if (configs && configs.time_format) {

            format = configs.time_format.value;
        }

        return format.replace('aaaaaa', 'aaaaa\'m\'');
    }

    getDateTimeFormat(preferences: UserPreferenceMap, configs: SystemConfigMap): string {
        const dateFormat = this.getDateFormat(preferences, configs);
        const timeFormat = this.getTimeFormat(preferences, configs);
        return dateFormat + ' ' + timeFormat;
    }
}
