import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {CurrencyDetailFieldComponent} from '@fields/currency/templates/detail/currency.component';
import {FormatCurrencyModule} from '@base/pipes/format-currency/format-currency.module';

@NgModule({
    declarations: [CurrencyDetailFieldComponent],
    exports: [CurrencyDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(CurrencyDetailFieldComponent),
        FormatCurrencyModule,
    ]
})
export class CurrencyDetailFieldModule {
}
