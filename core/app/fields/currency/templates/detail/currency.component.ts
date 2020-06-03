import {Component} from '@angular/core';
import {BaseNumberComponent} from '@fields/base/base-number.component';
import {UserPreferenceMap, UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigMap, SystemConfigStore} from '@store/system-config/system-config.store';

@Component({
    selector: 'scrm-currency-detail',
    templateUrl: './currency.component.html',
    styleUrls: []
})
export class CurrencyDetailFieldComponent extends BaseNumberComponent {
    constructor(
        protected userPreferences: UserPreferenceStore,
        protected systemConfig: SystemConfigStore
    ) {
        super(userPreferences, systemConfig);
    }

    getCode(preferences: UserPreferenceMap, configs: SystemConfigMap): string {

        if (preferences && preferences.currency && preferences.currency.iso4217) {
            return preferences.currency.iso4217;
        }

        if (configs && configs.currency && configs.currency.items.iso4217) {
            return configs.currency.items.iso4217;
        }

        return 'USD';
    }

    getCurrencySymbol(preferences: UserPreferenceMap, configs: SystemConfigMap): string {

        if (preferences && preferences.currency && preferences.currency.symbol) {
            return preferences.currency.symbol;
        }

        if (configs && configs.currency && configs.currency.items.symbol) {
            return configs.currency.items.symbol;
        }

        return '$';
    }

    getDigits(preferences: UserPreferenceMap, configs: SystemConfigMap): number {

        if (preferences && preferences.default_currency_significant_digits) {
            return preferences.default_currency_significant_digits;
        }

        if (configs && configs.default_currency_significant_digits) {
            return parseInt(configs.default_currency_significant_digits.value, 10);
        }

        return 2;
    }
}
