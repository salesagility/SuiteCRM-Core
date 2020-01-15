import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../app-manager/app-manager.module';
import { LogoutUiComponent } from './logout.component';

@NgModule({
declarations: [LogoutUiComponent],
exports: [LogoutUiComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(LogoutUiComponent)
]
})
export class LogoutUiModule {}
