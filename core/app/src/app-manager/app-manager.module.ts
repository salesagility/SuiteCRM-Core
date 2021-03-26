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

import {ModuleWithProviders, NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader, Type} from '@angular/core';

import {ROUTES} from '@angular/router';

import {AppManager} from './app-manager.service';

import {APP_COMPONENT, APP_MANIFESTS, APP_MODULE, AppManifest} from './app-manifest';

@NgModule()
export class AppManagerModule {
  static forRoot(manifests: AppManifest[]): ModuleWithProviders<AppManagerModule> {
    return {
      ngModule: AppManagerModule,
      providers: [
        AppManager,
        {provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader},
        // provider for Angular CLI to analyzes
        {provide: ROUTES, useValue: manifests, multi: true},
        // provider for AppManager to analyze
        {provide: APP_MANIFESTS, useValue: manifests}
      ]
    };
  }

  static forModule(manifest: AppManifest): ModuleWithProviders<AppManagerModule> {
    return {
      ngModule: AppManagerModule,
      providers: [
        // provider for @angular/router to parse
        {provide: ROUTES, useValue: manifest, multi: true},
        // provider for AppManager to analyze
        {provide: APP_MODULE, useValue: manifest}
      ]
    };
  }

  static forChild(component: Type<any>): ModuleWithProviders<AppManagerModule> {
    return {
      ngModule: AppManagerModule,
      providers: [
        // provider for @angular/router to parse
        {provide: ROUTES, useValue: [], multi: true},
        // provider for AppManager to analyze
        {provide: APP_COMPONENT, useValue: component}
      ]
    };
  }
}

export {AppManifest} from './app-manifest';
