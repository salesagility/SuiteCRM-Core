import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {BaseFieldComponent} from './base-field.component';
import {SystemConfigStore} from '@store/system-config/system-config.store';
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
        protected userPreferences: UserPreferenceStore,
        protected systemConfig: SystemConfigStore
    ) {
        super();
    }

    get format(): boolean {
        if (!this.field.metadata) {
            return true;
        }

        return this.field.metadata.format !== false;
    }
}
