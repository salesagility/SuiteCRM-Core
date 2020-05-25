import {Component} from '@angular/core';
import {UserPreferenceFacade} from '@store/user-preference/user-preference.facade';
import {BaseNumberComponent} from '@fields/base/base-number.component';
import {SystemConfigFacade} from '@store/system-config/system-config.facade';

@Component({
    selector: 'scrm-int-detail',
    templateUrl: './int.component.html',
    styleUrls: []
})
export class IntDetailFieldComponent extends BaseNumberComponent {

    constructor(
        protected userPreferences: UserPreferenceFacade,
        protected systemConfig: SystemConfigFacade
    ) {
        super(userPreferences, systemConfig);
    }
}
