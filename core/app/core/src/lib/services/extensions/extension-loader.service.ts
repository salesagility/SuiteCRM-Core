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

import {Compiler, Injectable, Injector, NgModuleFactory, NgModuleRef} from '@angular/core';
import {forkJoin, from, isObservable, Observable, of} from 'rxjs';
import {LoadChildrenCallback} from '@angular/router';
import {map, mergeMap} from 'rxjs/operators';
import {loadRemoteModule} from '@angular-architects/module-federation';
import {SystemConfigStore} from '../../store/system-config/system-config.store';
import {isFalse} from 'common';

interface ExtensionConfig {
    remoteEntry?: string,
    remoteName?: string,
    enabled?: boolean
}

export interface ModuleRefMap {
    [key: string]: NgModuleRef<any>
}

@Injectable({
    providedIn: 'root'
})
export class ExtensionLoader {

    constructor(
        protected systemConfigStore: SystemConfigStore,
        protected compiler: Compiler,
    ) {
    }

    /**
     * Load all extensions
     *
     * @param {object} injector Injector
     */
    public load(injector: Injector): Observable<ModuleRefMap> {

        const extensions = this.systemConfigStore.getConfigValue('extensions');

        const extensionModules$ = {};

        Object.keys(extensions).forEach(extensionName => {
            if (!extensions[extensionName]) {
                return;
            }

            const config: ExtensionConfig = extensions[extensionName];


            if (!config.remoteEntry || !config.remoteName) {
                return;
            }

            if (!config.enabled || isFalse(config.enabled)) {
                return;
            }

            extensionModules$[extensionName] = this.loadExtension(config, injector);
        });

        if (Object.keys(extensionModules$).length < 1) {
            return of({});
        }

        return forkJoin(extensionModules$);
    }

    /**
     * Load single extension
     *
     * @param {object} config ExtensionConfig
     * @param {object} injector Injector
     */
    public loadExtension(config: ExtensionConfig, injector: Injector): Observable<NgModuleRef<any>> {
        const promise = () => loadRemoteModule({
            remoteEntry: config.remoteEntry,
            remoteName: config.remoteName,
            exposedModule: './Module'
        }).then(m => m.ExtensionModule);

        return this.loadModuleFactory(promise).pipe(
            map((factory: NgModuleFactory<any>) => {
                return factory.create(injector);
            })
        );
    }

    /**
     * Check if object is a promise
     * @param {} obj promise
     * @returns {boolean} isPromise
     */
    protected isPromise<T = any>(obj: any): obj is Promise<T> {
        return !!obj && typeof obj.then === 'function';
    }

    /**
     * Wrap into observable
     *
     * @param {object} value to wrap
     * @returns {object} observable
     */
    protected wrapIntoObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
        if (isObservable(value)) {
            // @ts-ignore
            return value;
        }

        if (this.isPromise(value)) {
            // @ts-ignore
            return from(Promise.resolve(value));
        }

        // @ts-ignore
        return of(value);
    }

    /**
     * Load module factory and return observable
     * @param {function} loadChildren
     */
    protected loadModuleFactory(loadChildren: LoadChildrenCallback): Observable<NgModuleFactory<any>> {
        return this.wrapIntoObservable(loadChildren()).pipe(mergeMap((t: any) => {
            if (t instanceof NgModuleFactory) {
                return of(t);
            } else {
                return from(this.compiler.compileModuleAsync(t));
            }
        }));
    }
}
