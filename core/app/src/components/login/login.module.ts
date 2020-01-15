import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppManagerModule} from '../../app-manager/app-manager.module';
import {LoginUiComponent} from './login.component';
import {LogoUiModule} from '../logo/logo.module';
import {SvgIconUiModule} from '../svg-icon/svg-icon.module';
import {LoginUiRoutes} from './login.routes';

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
        SvgIconUiModule,
        AppManagerModule.forChild(LoginUiComponent),
        RouterModule.forChild(LoginUiRoutes),
        CommonModule,
    ]
})
export class LoginUiModule {
}
