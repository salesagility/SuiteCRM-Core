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

import {
  ComponentFactory,
  Inject,
  Injectable,
  Injector,
  NgModuleFactory,
  NgModuleFactoryLoader
} from '@angular/core';

import {from, Observable, throwError} from 'rxjs';

import {
  AppManifest,
  APP_COMPONENT,
  APP_MANIFESTS,
  APP_MODULE
} from './app-manifest';

@Injectable()
export class AppManager {
  constructor(
    @Inject(APP_MANIFESTS)
    private manifests: AppManifest[],
    private loader: NgModuleFactoryLoader,
    private injector: Injector
  ) {
  }

  /** Retrieve a ComponentFactory, based on the specified componentId
   *  (defined in the AppManifest array).
   */
  getComponentFactory<T>(
    componentId: string,
    injector?: Injector
  ): Observable<ComponentFactory<T>> {
    const manifest = this.manifests.find(m => m.componentId === componentId);
    if (!manifest) {
      return throwError(
        `AppManager: Unknown componentId "${componentId}"`
      );
    }

    const path = manifest.loadChildren;

    const p = this.load<T>(path, componentId, injector);
    return from(p);
  }

  load<T>(
    path: string,
    componentId: string,
    injector?: Injector
  ): Promise<ComponentFactory<T>> {
    return this.loader
      .load(path)
      .then(ngModuleFactory =>
        this.loadFactory<T>(ngModuleFactory, componentId, injector)
      );
  }

  loadFactory<T>(
    ngModuleFactory: NgModuleFactory<any>,
    componentId: string,
    injector?: Injector
  ): Promise<ComponentFactory<T>> {
    const moduleRef = ngModuleFactory.create(injector || this.injector);
    const appComponentType = moduleRef.injector.get(
      APP_COMPONENT,
      null
    );
    if (!appComponentType) {
      const AppModule: AppManifest = moduleRef.injector.get(
        APP_MODULE,
        null
      );

      if (!AppModule) {
        throw new Error(
          'AppManager: App module for' +
          ` componentId "${componentId}" does not contain` +
          ' APP_COMPONENT or App_MODULE as a provider.'
        );
      }
      if (AppModule.componentId !== componentId) {
        throw new Error(
          'AppManager: App module for' +
          `${componentId} does not match manifest.`
        );
      }

      const path = AppModule.loadChildren;

      if (!path) {
        throw new Error(`${componentId} unknown!`);
      }

      return this.load<T>(path, componentId, injector);
    }

    return Promise.resolve(
      moduleRef.componentFactoryResolver.resolveComponentFactory<T>(
        appComponentType
      )
    );
  }

  loadAppComponent(outlet: any, componentId: string, data: any) {
    this.getComponentFactory<any>(componentId)
      .subscribe({
        next: componentFactory => {
          if (!outlet) {
            return;
          }

          const ref = outlet.createComponent(componentFactory);
          ref.changeDetectorRef.detectChanges();

          const appComponent = ref.instance;

          appComponent.data = data;
        },
        error: err => {
          console.warn(err);
        }
      });
  }
}
