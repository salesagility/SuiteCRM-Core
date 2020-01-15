import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../app-manager/app-manager.module';
import { LogoUiComponent } from './logo.component';

@NgModule({
declarations: [LogoUiComponent],
exports: [LogoUiComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(LogoUiComponent)
]
})
export class LogoUiModule {}
