import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../app-manager/app-manager.module';
import { SvgIconUiComponent } from './svg-icon.component';

@NgModule({
declarations: [SvgIconUiComponent],
exports: [SvgIconUiComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(SvgIconUiComponent)
]
})
export class SvgIconUiModule {}
