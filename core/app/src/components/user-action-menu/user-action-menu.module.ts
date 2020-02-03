import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagerModule } from '../../app-manager/app-manager.module';
import { UserActionMenuUiComponent } from './user-action-menu.component';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
declarations: [UserActionMenuUiComponent],
exports: [UserActionMenuUiComponent],
imports: [
    CommonModule,
    AppManagerModule.forChild(UserActionMenuUiComponent),
    AngularSvgIconModule
]
})
export class UserActionMenuUiModule {}
