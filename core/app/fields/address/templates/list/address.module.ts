import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../../../src/app-manager/app-manager.module';
import { AddressListFieldsComponent } from './address.component';

@NgModule({
declarations: [AddressListFieldsComponent],
exports: [AddressListFieldsComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(AddressListFieldsComponent)
]
})
export class AddressListFieldsModule {}