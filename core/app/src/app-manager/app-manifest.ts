import {InjectionToken} from '@angular/core';

export const APP_COMPONENT = new InjectionToken<any>('APP_COMPONENT');
export const APP_MODULE = new InjectionToken<any>('APP_MODULE');
export const APP_MANIFESTS = new InjectionToken<any>('APP_MANIFESTS');

export interface AppManifest {
  /** Unique identifier, used in the application to retrieve a ComponentFactory. */
  componentId: string;

  /** Unique identifier, used internally by Angular. */
  path: string;

  /** Path to component module. */
  loadChildren: string;
}
