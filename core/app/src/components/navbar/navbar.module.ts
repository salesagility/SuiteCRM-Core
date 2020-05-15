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
import {MenuItemComponent} from '@components/navbar/menu-item/menu-item.component';
import {MenuRecentlyViewedComponent} from '@components/navbar/menu-recently-viewed/menu-recently-viewed.component';
import {HomeMenuItemComponent} from '@components/navbar/home-menu-item/home-menu-item.component';
import { MenuItemLinkComponent } from './menu-item-link/menu-item-link.component';
import { GroupedMenuItemComponent } from './grouped-menu-item/grouped-menu-item.component';
import { MenuItemsListComponent } from './menu-items-list/menu-items-list.component';


@NgModule({
    declarations: [
        NavbarUiComponent,
        MenuItemComponent,
        MenuRecentlyViewedComponent,
        HomeMenuItemComponent,
        MenuItemLinkComponent,
        GroupedMenuItemComponent,
        MenuItemsListComponent
    ],
    exports:  [
        NavbarUiComponent,
        MenuItemComponent,
        MenuRecentlyViewedComponent,
        HomeMenuItemComponent
    ],
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
