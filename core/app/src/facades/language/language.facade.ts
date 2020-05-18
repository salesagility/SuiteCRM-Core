import {Injectable} from '@angular/core';

import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {distinctUntilChanged, first, map, shareReplay, tap} from 'rxjs/operators';
import {RecordGQL} from '@services/api/graphql-api/api.record.get';
import {AppStateFacade} from '@base/facades/app-state/app-state.facade';
import {deepClone} from '@base/utils/object-utils';
import {StateFacade} from '@base/facades/state';

export interface LanguageStringMap {
    [key: string]: string;
}

export interface LanguageListStringMap {
    [key: string]: string | LanguageStringMap;
}

export interface LoadedLanguageStringMap {
    [key: string]: LanguageStringMap;
}

export interface LanguageState {
    appStrings: LanguageStringMap;
    appListStrings: LanguageListStringMap;
    modStrings: LanguageListStringMap;
    languageKey: string;
    loaded?: LoadedLanguageStringMap;
    hasChanged: boolean;
}

export interface LanguageCache {
    [key: string]: {
        [key: string]: Observable<any>;
    };
}

const initialState: LanguageState = {
    appStrings: {},
    appListStrings: {},
    modStrings: {},
    languageKey: 'en_us',
    loaded: {},
    hasChanged: false
};

let internalState: LanguageState = deepClone(initialState);

const initialCache: LanguageCache = {
    appStrings: {},
    appListStrings: {},
    modStrings: {},
};

let loadedLanguages = {};
let cache: LanguageCache = deepClone(initialCache);

@Injectable({
    providedIn: 'root',
})
export class LanguageFacade implements StateFacade {
    protected store = new BehaviorSubject<LanguageState>(internalState);
    protected state$ = this.store.asObservable();

    protected config = {
        appStrings: {
            fetch: 'fetchAppStrings',
            resourceName: 'appStrings',
            metadata: {
                fields: [
                    'id',
                    '_id',
                    'items'
                ]
            }
        },
        appListStrings: {
            fetch: 'fetchAppListStrings',
            resourceName: 'appListStrings',
            metadata: {
                fields: [
                    'id',
                    '_id',
                    'items'
                ]
            }
        },
        modStrings: {
            fetch: 'fetchModStrings',
            resourceName: 'modStrings',
            metadata: {
                fields: [
                    'id',
                    '_id',
                    'items'
                ]
            }
        },
    };

    /**
     * Public long-lived observable streams
     */
    appStrings$ = this.state$.pipe(map(state => state.appStrings), distinctUntilChanged());
    appListStrings$ = this.state$.pipe(map(state => state.appListStrings), distinctUntilChanged());
    modStrings$ = this.state$.pipe(map(state => state.modStrings), distinctUntilChanged());
    languageKey$ = this.state$.pipe(map(state => state.languageKey), distinctUntilChanged());

    constructor(private recordGQL: RecordGQL, private appStateFacade: AppStateFacade) {
    }

    /**
     * Public Api
     */

    /**
     * Clear state
     */
    public clear(): void {
        loadedLanguages = {};
        cache = deepClone(initialCache);
        this.updateState(deepClone(initialState));
    }

    /**
     * Update the language strings toe the given language
     *
     * @param languageKey
     */
    public changeLanguage(languageKey: string): void {
        const types = [];

        Object.keys(loadedLanguages).forEach(type => loadedLanguages[type] && types.push(type));

        internalState.hasChanged = true;

        this.appStateFacade.updateLoading('change-language', true);

        this.load(languageKey, types).pipe(
            tap(() => this.appStateFacade.updateLoading('change-language',false))
        ).subscribe();
    }

    /**
     * Get AppStrings label by key
     *
     * @param labelKey
     */
    public getAppString(labelKey: string): string {

        if (!internalState.appStrings || !internalState.appStrings[labelKey]) {
            return null;
        }
        return internalState.appStrings[labelKey];
    }

    /**
     * Get AppListStrings label by key
     *
     * @param labelKey
     */
    public getAppListString(labelKey: string): string | LanguageStringMap {

        if (!internalState.appListStrings || !internalState.appListStrings[labelKey]) {
            return null;
        }

        return internalState.appListStrings[labelKey];
    }

    /**
     * Get ModStrings label by key
     *
     * @param labelKey
     */
    public getModString(labelKey: string): string | LanguageStringMap {

        if (!internalState.modStrings || !internalState.modStrings[labelKey]) {
            return null;
        }

        return internalState.modStrings[labelKey];
    }

    /**
     * Get all available string types
     *
     * @returns Observable
     */
    public getAvailableStringsTypes(): string[] {
        return Object.keys(this.config);
    }

    /**
     * Returns whether the language has changed manually
     *
     * @returns bool
     */
    public hasLanguageChanged(): boolean {
        return internalState.hasChanged;
    }

    /**
     * Returns the currently active language
     *
     * @returns string
     */
    public getCurrentLanguage(): string {
        return internalState.languageKey;
    }


    /**
     * Initial Language Strings Load for given language and types if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param languageKey
     * @param types
     * @returns Observable
     */
    public load(languageKey: string, types: string[]): Observable<{}> {

        const streams$ = {};

        types.forEach(type => streams$[type] = this.getStrings(languageKey, type));

        return forkJoin(streams$).pipe(
            first(),
            tap(result => {
                const stateUpdate = {...internalState, languageKey};

                types.forEach(type => {
                    stateUpdate[type] = result[type];
                    loadedLanguages[type] = true;
                });

                this.updateState(stateUpdate);
            })
        );
    }


    /**
     * Internal API
     */


    /**
     * Update internal state cache and emit from store...
     *
     * @param state
     */
    protected updateState(state: LanguageState): void {
        this.store.next(internalState = state);
    }

    /**
     * Get given $type of strings Observable from cache  or call the backend
     *
     * @param language
     * @param type
     * @returns Observable<any>
     */
    protected getStrings(language: string, type: string): Observable<{}> {

        const stringsCache = cache[type];
        const fetchMethod = this.config[type].fetch;

        if (stringsCache[language]) {
            return stringsCache[language];
        }

        stringsCache[language] = this[fetchMethod](language).pipe(
            shareReplay(1),
        );

        return stringsCache[language];
    }

    /**
     * Fetch the App strings from the backend
     *
     * @param language
     * @returns Observable<{}>
     */
    protected fetchAppStrings(language: string): Observable<{}> {
        const resourceName = this.config.appStrings.resourceName;
        const fields = this.config.appStrings.metadata;
        return this.recordGQL.fetch(resourceName, `/api/app-strings/${language}`, fields)
            .pipe(
                map(({data}) => {
                    let items = {};

                    if (data.appStrings) {
                        items = data.appStrings.items;
                    }

                    return items;
                })
            );
    }

    /**
     * Fetch the App list strings from the backend
     *
     * @param language
     * @returns Observable<{}>
     */
    protected fetchAppListStrings(language: string): Observable<{}> {
        const resourceName = this.config.appListStrings.resourceName;
        const fields = this.config.appListStrings.metadata;

        return this.recordGQL.fetch(resourceName, `/api/app-list-strings/${language}`, fields)
            .pipe(
                map(({data}) => {
                    let items = {};

                    if (data.appListStrings) {
                        items = data.appListStrings.items;
                    }

                    return items;
                })
            );
    }

    /**
     * Fetch the Mod strings from the backend
     *
     * @param language
     * @returns Observable<{}>
     */
    protected fetchModStrings(language: string): Observable<{}> {
        const resourceName = this.config.modStrings.resourceName;
        const fields = this.config.modStrings.metadata;
        return this.recordGQL.fetch(resourceName, `/api/mod-strings/${language}`, fields)
            .pipe(
                map(({data}) => {
                    let items = {};

                    if (data.modStrings) {
                        items = data.modStrings.items;
                    }

                    return items;
                })
            );
    }
}
