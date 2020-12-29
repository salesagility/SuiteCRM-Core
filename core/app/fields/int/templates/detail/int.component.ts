import {Component} from '@angular/core';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {BaseNumberComponent} from '@fields/base/base-number.component';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-int-detail',
    templateUrl: './int.component.html',
    styleUrls: []
})
export class IntDetailFieldComponent extends BaseNumberComponent {

    constructor(
        protected userPreferences: UserPreferenceStore,
        protected systemConfig: SystemConfigStore,
        protected typeFormatter: DataTypeFormatter
    ) {
        super(userPreferences, systemConfig, typeFormatter);
    }
}
