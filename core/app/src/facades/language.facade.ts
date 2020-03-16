import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';
import {map, distinctUntilChanged, tap, shareReplay, first} from 'rxjs/operators';
import {RecordGQL} from '@services/api/graphql-api/api.record.get';
import {AppStateFacade} from "@base/facades/app-state.facade";

export interface LanguageStringMap {
    [key: string]: string;
}

export interface LoadedLanguageStringMap {
    [key: string]: LanguageStringMap;
}

export interface LanguageState {
    languageStrings: LanguageStringMap;
    languageType: string;
    loaded?: LoadedLanguageStringMap;
}

let internalState: LanguageState = {
    languageStrings: {},
    languageType: 'en_us',
    loaded: {}
};

const cache: { [key: string]: Observable<any> } = {};

@Injectable({
    providedIn: 'root',
})
export class LanguageFacade {
    protected store = new BehaviorSubject<LanguageState>(internalState);
    protected state$ = this.store.asObservable();
    protected resourceName = 'appStrings';
    protected fieldsMetadata = {
        fields: [
            'id',
            '_id',
            'items'
        ]
    };

    /**
     * Public long-lived observable streams
     */
    languageStrings$ = this.state$.pipe(map(state => state.languageStrings), distinctUntilChanged());
    languageType$ = this.state$.pipe(map(state => state.languageType), distinctUntilChanged());

    constructor(private recordGQL: RecordGQL, private appStateFacade: AppStateFacade) {
    }

    /**
     * Public Api
     */

    /**
     * Update the AppStrings to the given language
     *
     * @param languageType
     */
    public updateLanguage(languageType: string): void {
        this.loadAppStrings(languageType).subscribe();
    }

    /**
     * Initial AppStrings Load for given if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param languageType
     * @returns Observable
     */
    public loadAppStrings(languageType: string): Observable<{}> {

        return this.getAppStrings(languageType).pipe(
            first(),
            tap((languageStrings: LanguageStringMap) => {
                this.updateState({...internalState, languageStrings, languageType});
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
     * Get AppStrings cached Observable or call the backend
     *
     * @param language
     * @returns Observable<any>
     */
    protected getAppStrings(language: string): Observable<{}> {

        if (cache[language]) {
            return cache[language];
        }

        this.appStateFacade.updateLoading(true);

        cache[language] = this.fetchAppStrings(language).pipe(
            shareReplay(1),
            tap(() => this.appStateFacade.updateLoading(false))
        );

        return cache[language];
    }

    /**
     * Fetch the App strings from the backend
     *
     * @param language
     * @returns Observable<{}>
     */
    protected fetchAppStrings(language: string): Observable<{}> {
        return this.recordGQL.fetch(this.resourceName, `/api/app-strings/${language}`, this.fieldsMetadata)
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
}
