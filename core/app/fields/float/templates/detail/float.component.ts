import {Component} from '@angular/core';
import {BaseNumberComponent} from '@fields/base/base-number.component';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-float-detail',
    templateUrl: './float.component.html',
    styleUrls: []
})
export class FloatDetailFieldComponent extends BaseNumberComponent {
    constructor(
        protected userPreferences: UserPreferenceStore,
        protected systemConfig: SystemConfigStore,
        protected typeFormatter: DataTypeFormatter
    ) {
        super(userPreferences, systemConfig, typeFormatter);
    }
}
