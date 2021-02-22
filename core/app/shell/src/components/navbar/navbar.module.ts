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
