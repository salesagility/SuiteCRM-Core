import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppManagerModule} from '../../app-manager/app-manager.module';
import {LoginUiComponent} from './login.component';
import {LogoUiModule} from '../logo/logo.module';
import {LoginUiRoutes} from './login.routes';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ImageModule} from '@components/image/image.module';

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
        ImageModule
    ]
})
export class LoginUiModule {
}
