import {Component} from '@angular/core';
import {BaseNumberComponent} from '@fields/base/base-number.component';
import {UserPreferenceFacade} from '@store/user-preference/user-preference.facade';
import {SystemConfigFacade} from '@store/system-config/system-config.facade';

@Component({
    selector: 'scrm-float-detail',
    templateUrl: './float.component.html',
    styleUrls: []
})
export class FloatDetailFieldComponent extends BaseNumberComponent {
    constructor(
        protected userPreferences: UserPreferenceFacade,
        protected systemConfig: SystemConfigFacade
    ) {
        super(userPreferences, systemConfig);
    }
}
