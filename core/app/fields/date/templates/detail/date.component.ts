import {Component,} from '@angular/core';
import {BaseDateTimeComponent} from '@fields/base/base-datetime.component';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';

@Component({
    selector: 'scrm-date-detail',
    templateUrl: './date.component.html',
    styleUrls: []
})
export class DateDetailFieldComponent extends BaseDateTimeComponent {

    constructor(
        protected userPreferences: UserPreferenceStore,
        protected systemConfig: SystemConfigStore
    ) {
        super(userPreferences, systemConfig);
    }
}
