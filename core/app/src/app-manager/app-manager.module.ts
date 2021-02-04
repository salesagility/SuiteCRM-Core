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
