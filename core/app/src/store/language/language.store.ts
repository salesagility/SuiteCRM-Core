import {Injectable} from '@angular/core';

import {BehaviorSubject, combineLatest, forkJoin, Observable} from 'rxjs';
import {distinctUntilChanged, first, map, shareReplay, tap} from 'rxjs/operators';
import {RecordGQL} from '@services/api/graphql-api/api.record.get';
import {AppStateStore} from '@store/app-state/app-state.store';
import {deepClone} from '@base/utils/object-utils';
import {StateStore} from '@base/store/state';

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

export interface LanguageStrings {
    appStrings: LanguageStringMap;
    appListStrings: LanguageListStringMap;
    modStrings: LanguageListStringMap;
    languageKey: string;
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
export class LanguageStore implements StateStore {
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

    /**
     * ViewModel that resolves once all the data is ready (or updated)...
     */
    vm$: Observable<LanguageStrings> = combineLatest(
        [
            this.appStrings$,
            this.appListStrings$,
            this.modStrings$,
            this.languageKey$
        ])
        .pipe(
            map((
                [
                    appStrings,
                    appListStrings,
                    modStrings,
                    languageKey
                ]) => ({appStrings, appListStrings, modStrings, languageKey})
            )
        );

    constructor(private recordGQL: RecordGQL, private appStateStore: AppStateStore) {
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

    public clearAuthBased(): void {
        const keysToClear = ['modStrings', 'appListStrings'];

        keysToClear.forEach(type => {
            if (loadedLanguages && loadedLanguages[type]) {
                delete loadedLanguages[type];
            }
        });

        cache.modStrings = {};
        cache.appListStrings = {};
    }

    /**
     * Update the language strings toe the given language
     *
     * @param {string} languageKey language key
     */
    public changeLanguage(languageKey: string): void {
        const types = [];

        Object.keys(loadedLanguages).forEach(type => loadedLanguages[type] && types.push(type));

        internalState.hasChanged = true;

        this.appStateStore.updateLoading('change-language', true);

        this.load(languageKey, types).pipe(
            tap(() => this.appStateStore.updateLoading('change-language', false))
        ).subscribe();
    }

    /**
     * Get AppStrings label by key
     *
     * @param {string} labelKey to fetch
     * @returns {string} label
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
     * @param {string} labelKey to fetch
     * @returns {string|{}} app strings
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
     * @param {string} labelKey to fetch
     * @returns {string|{}} mod strings
     */
    public getModString(labelKey: string): string | LanguageStringMap {

        if (!internalState.modStrings || !internalState.modStrings[labelKey]) {
            return null;
        }

        return internalState.modStrings[labelKey];
    }

    /**
     * Get field label
     *
     * @param {string} labelKey to fetch
     * @param {string} module to use
     * @param {object} languages to use
     * @returns {string} label
     */
    public getFieldLabel(labelKey: string, module: string, languages: LanguageStrings): string {
        if (!languages || !languages.modStrings || !labelKey || !module) {
            return '';
        }

        let label = languages.modStrings[module] && languages.modStrings[module][labelKey];

        if (!label) {
            label = languages.appStrings && languages.appStrings[labelKey];
        }

        return label || '';
    }

    /**
     * Get all available string types
     *
     * @returns {string[]} string types
     */
    public getAvailableStringsTypes(): string[] {
        return Object.keys(this.config);
    }

    /**
     * Returns whether the language has changed manually
     *
     * @returns {boolean} has changed
     */
    public hasLanguageChanged(): boolean {
        return internalState.hasChanged;
    }

    /**
     * Returns the currently active language
     *
     * @returns {string} current language key
     */
    public getCurrentLanguage(): string {
        return internalState.languageKey;
    }


    /**
     * Initial Language Strings Load for given language and types if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} languageKey to load
     * @param {string[]} types to load
     * @returns {{}} Observable
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
     * @param {{}} state to set
     */
    protected updateState(state: LanguageState): void {
        this.store.next(internalState = state);
    }

    /**
     * Get given $type of strings Observable from cache  or call the backend
     *
     * @param {string} language to load
     * @param {string} type load
     * @returns {{}} Observable<any>
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
     * @param {string} language to fetch
     * @returns {{}} Observable<{}>
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
     * @param {string} language to fetch
     * @returns {{}} Observable<{}>
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
     * @param {string} language to fetch
     * @returns {{}} Observable<{}>
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
