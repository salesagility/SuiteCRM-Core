import {Component} from '@angular/core';
import {BaseNumberComponent} from '@fields/base/base-number.component';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {FormatOptions} from '@services/formatters/formatter.model';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-currency-detail',
    templateUrl: './currency.component.html',
    styleUrls: []
})
export class CurrencyDetailFieldComponent extends BaseNumberComponent {
    constructor(
        protected userPreferences: UserPreferenceStore,
        protected systemConfig: SystemConfigStore,
        protected typeFormatter: DataTypeFormatter
    ) {
        super(userPreferences, systemConfig, typeFormatter);
    }

    getOptions(): FormatOptions {
        let options = null;
        if (this.field && this.field.metadata && this.field.metadata.digits !== null && isFinite(this.field.metadata.digits)) {
            options = {
                digits: this.field.metadata.digits
            };
        }
        return options;
    }
}
