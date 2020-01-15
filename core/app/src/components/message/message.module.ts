import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../app-manager/app-manager.module';
import { MessageUiComponent } from './message.component';

@NgModule({
declarations: [MessageUiComponent],
exports: [MessageUiComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(MessageUiComponent)
]
})
export class MessageUiModule {}
