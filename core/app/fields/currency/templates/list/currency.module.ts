import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { CurrencyListFieldsComponent } from './currency.component';

@NgModule({
declarations: [CurrencyListFieldsComponent],
exports: [CurrencyListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(CurrencyListFieldsComponent)
]
})
export class CurrencyListFieldsModule {}