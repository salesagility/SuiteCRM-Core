import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable, combineLatest, of} from 'rxjs';
import {map, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {RecordGQL} from '@services/api/graphql-api/api.record.get';
import {AppStateFacade} from "@base/facades/app-state.facade";

export interface LanguageStringMap {
    [key: string]: string;
}

export interface LanguageState {
    languageStrings: LanguageStringMap;
    languageType: string;
    loaded?: [];
}

let _state: LanguageState = {
    languageStrings: {},
    languageType: 'en_us',
    loaded: []
};

@Injectable({
    providedIn: 'root',
})
export class LanguageFacade {
    protected store = new BehaviorSubject<LanguageState>(_state);
    protected state$ = this.store.asObservable();
    protected resourceName = 'appStrings';
    protected fieldsMetadata = {
        fields: [
            'id',
            '_id',
            'items'
        ]
    };

    languageStrings$ = this.state$.pipe(map(state => state.languageStrings), distinctUntilChanged());
    languageType$ = this.state$.pipe(map(state => state.languageType), distinctUntilChanged());
    loaded$ = this.state$.pipe(map(state => state.loaded));

    vm$: Observable<LanguageState> = combineLatest([
        this.languageStrings$,
        this.languageType$,
        this.loaded$
    ]).pipe(
        map(([languageStrings, languageType, loaded]) => {
            return {languageStrings, languageType, loaded};
        })
    );

    constructor(private recordGQL: RecordGQL, private appStateFacade: AppStateFacade) {
    }

    // ------- Public Methods ------------------------

    public updateLanguage(languageType: string): void {
        this.updateState({..._state, languageType});
    }

    public loadAppStrings(lang: string): Observable<{}> {

        this.updateState({..._state, languageType: lang});

        const appStrings$ = combineLatest([this.languageType$]).pipe(
            switchMap(([languageType]) => this.fetchAppStrings(languageType))
        );

        appStrings$.subscribe(languageStrings => {
            this.updateState({..._state, languageStrings});
        });

        return of(appStrings$);
    }

    // ------- Private Methods ------------------------

    /**
     * Update internal state cache and emit from store...
     * @param state
     */
    protected updateState(state: LanguageState): void {
        this.store.next(_state = state);
    }

    protected fetchAppStrings(language: string): Observable<{}> {
        this.appStateFacade.updateLoading(true);
        return this.recordGQL
            .fetch(this.resourceName, `/api/app-strings/${language}`, this.fieldsMetadata)
            .pipe(map(({data}) => {
                    let items = {};

                    if (data.appStrings) {
                        items = data.appStrings.items;
                    }

                    return items;
                }),
                tap(() => this.appStateFacade.updateLoading(false)));
    }
}
