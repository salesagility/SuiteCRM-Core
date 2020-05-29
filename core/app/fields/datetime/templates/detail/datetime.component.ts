import {Component,} from '@angular/core';
import {BaseDateTimeComponent} from '@fields/base/base-datetime.component';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';

@Component({
    selector: 'scrm-datetime-detail',
    templateUrl: './datetime.component.html',
    styleUrls: []
})
export class DateTimeDetailFieldComponent extends BaseDateTimeComponent {

    constructor(
        protected userPreferences: UserPreferenceStore,
        protected systemConfig: SystemConfigStore
    ) {
        super(userPreferences, systemConfig);
    }
}
