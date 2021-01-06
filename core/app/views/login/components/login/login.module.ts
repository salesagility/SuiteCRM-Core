import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {LoginUiComponent} from './login.component';
import {LogoUiModule} from '@components/logo/logo.module';
import {LoginUiRoutes} from './login.routes';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ImageModule} from '@components/image/image.module';
import {ButtonLoadingUiModule} from '@base/directives/button-loading/button-loading.module';

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
        AngularSvgIconModule,
        ImageModule,
        ButtonLoadingUiModule
    ]
})
export class LoginUiModule {
}
