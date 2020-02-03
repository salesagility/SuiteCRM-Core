import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppManagerModule} from '../../app-manager/app-manager.module';
import {LoginUiComponent} from './login.component';
import {LogoUiModule} from '../logo/logo.module';
import {LoginUiRoutes} from './login.routes';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [
        LoginUiComponent
    ],
    exports: [
        LoginUiComponent
    ],
    imports: [
        FormsModule,
        LogoUiModule,
        AppManagerModule.forChild(LoginUiComponent),
        RouterModule.forChild(LoginUiRoutes),
        CommonModule,
        AngularSvgIconModule
    ]
})
export class LoginUiModule {
}
