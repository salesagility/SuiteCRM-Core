/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarUiComponent} from './navbar.component';

import {LogoUiModule} from '../logo/logo.module';
import {LogoutUiModule} from '../logout/logout.module';
import {ActionBarUiModule} from '../action-bar/action-bar.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {MenuItemLinkComponent} from './menu-item-link/menu-item-link.component';
import {GroupedMenuItemComponent} from './grouped-menu-item/grouped-menu-item.component';
import {MenuItemsListComponent} from './menu-items-list/menu-items-list.component';
import {MenuRecentlyViewedComponent} from './menu-recently-viewed/menu-recently-viewed.component';
import {HomeMenuItemComponent} from './home-menu-item/home-menu-item.component';
import {MenuItemComponent} from './menu-item/menu-item.component';
import {ImageModule} from '../image/image.module';
import {BaseNavbarComponent} from './base-navbar/base-navbar.component';
import {DynamicModule} from 'ng-dynamic-component';
import {BaseMenuItemLinkComponent} from './menu-item-link/base-menu-item-link.component';
import {BaseMenuItemComponent} from './menu-item/base-menu-item.component';
import {BaseGroupedMenuItemComponent} from './grouped-menu-item/base-grouped-menu-item.component';
import {BaseHomeMenuItemComponent} from './home-menu-item/base-home-menu-item.component';
import {BaseMenuRecentlyViewedComponent} from './menu-recently-viewed/base-menu-recently-viewed.component';
import {BaseMenuItemsListComponent} from './menu-items-list/base-menu-items-list.component';
import {LogoutUiComponent} from '../logout/logout.component';
import {LabelModule} from '../label/label.module';
import {MobileMenuComponent} from './mobile-menu/mobile-menu.component';
import {BaseMobileMenuComponent} from './mobile-menu/base-mobile-menu.component';
import {MobileGroupedMenuComponent} from './mobile-grouped-menu/mobile-grouped-menu.component';
import {BaseMobileGroupedMenuComponent} from './mobile-grouped-menu/base-mobile-grouped-menu.component';
import {MobileModuleMenuComponent} from './mobile-module-menu/mobile-module-menu.component';
import {BaseMobileModuleMenuComponent} from './mobile-module-menu/base-mobile-module-menu.component';


@NgModule({
    declarations: [
        NavbarUiComponent,
        MenuItemComponent,
        BaseMenuItemComponent,
        MenuRecentlyViewedComponent,
        BaseMenuRecentlyViewedComponent,
        HomeMenuItemComponent,
        MenuItemLinkComponent,
        BaseHomeMenuItemComponent,
        BaseMenuItemLinkComponent,
        GroupedMenuItemComponent,
        BaseGroupedMenuItemComponent,
        MenuItemsListComponent,
        BaseMenuItemsListComponent,
        BaseNavbarComponent,
        MobileMenuComponent,
        BaseMobileMenuComponent,
        MobileGroupedMenuComponent,
        BaseMobileGroupedMenuComponent,
        MobileModuleMenuComponent,
        BaseMobileModuleMenuComponent
    ],
    exports: [
        NavbarUiComponent,
        MenuItemComponent,
        BaseMenuItemComponent,
        MenuRecentlyViewedComponent,
        BaseMenuRecentlyViewedComponent,
        HomeMenuItemComponent,
        MenuItemLinkComponent,
        BaseHomeMenuItemComponent,
        BaseMenuItemLinkComponent,
        GroupedMenuItemComponent,
        BaseGroupedMenuItemComponent,
        MenuItemsListComponent,
        BaseMenuItemsListComponent,
        BaseNavbarComponent,
        LogoutUiComponent,
        MobileMenuComponent,
        BaseMobileMenuComponent,
        MobileGroupedMenuComponent,
        BaseMobileGroupedMenuComponent,
        MobileModuleMenuComponent,
        BaseMobileModuleMenuComponent
    ],
    imports: [
        CommonModule,
        LogoUiModule,
        LogoutUiModule,
        ActionBarUiModule,
        NgbModule,
        RouterModule,
        ImageModule,
        DynamicModule,
        LabelModule
    ]
})
export class NavbarUiModule {
}
