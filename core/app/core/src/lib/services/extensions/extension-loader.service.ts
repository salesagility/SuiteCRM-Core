import {Compiler, Injectable, Injector, NgModuleFactory} from '@angular/core';
import {from, isObservable, Observable, of} from 'rxjs';
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
    public load(injector: Injector): void {

        const extensions = this.systemConfigStore.getConfigValue('extensions');

        Object.keys(extensions).forEach(extensionName => {
            if (!extensions[extensionName]) {
                return;
            }

            const config: ExtensionConfig = extensions[extensionName];
            this.loadExtension(config, injector);
        });

    }

    /**
     * Load single extension
     *
     * @param {object} config ExtensionConfig
     * @param {object} injector Injector
     */
    public loadExtension(config: ExtensionConfig, injector: Injector): void {

        if (!config.remoteEntry || !config.remoteName) {
            return;
        }

        if (!config.enabled || isFalse(config.enabled)) {
            return;
        }

        const promise = () => loadRemoteModule({
            remoteEntry: config.remoteEntry,
            remoteName: config.remoteName,
            exposedModule: './Module'
        }).then(m => m.ExtensionModule);

        this.loadModuleFactory(promise).pipe(
            map((factory: NgModuleFactory<any>) => {
                factory.create(injector);
            })
        ).subscribe();
    }

    /**
     * Check if object is a promise
     * @param {any} obj promise
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
