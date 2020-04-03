import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {NavbarUiComponent} from './navbar.component';

import {LogoUiModule} from '../logo/logo.module';
import {LogoutUiModule} from '../logout/logout.module';
import {ActionBarUiModule} from '../action-bar/action-bar.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {ImageModule} from '@components/image/image.module';


@NgModule({
    declarations: [NavbarUiComponent],
    exports: [NavbarUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(NavbarUiComponent),
        LogoUiModule,
        LogoutUiModule,
        ActionBarUiModule,
        NgbModule,
        RouterModule,
        ImageModule
    ]
})
export class NavbarUiModule {
}
