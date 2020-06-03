import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormatCurrencyPipe} from '@base/pipes/format-currency/format-currency.pipe';

@NgModule({
    declarations: [
        FormatCurrencyPipe
    ],
    exports: [
        FormatCurrencyPipe
    ],
    imports: [
        CommonModule,
    ]
})
export class FormatCurrencyModule {
}
