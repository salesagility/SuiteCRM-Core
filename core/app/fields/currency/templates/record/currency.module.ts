import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { CurrencyRecordFieldsComponent } from './currency.component';

@NgModule({
declarations: [CurrencyRecordFieldsComponent],
exports: [CurrencyRecordFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(CurrencyRecordFieldsComponent)
]
})
export class CurrencyRecordFieldsModule {}