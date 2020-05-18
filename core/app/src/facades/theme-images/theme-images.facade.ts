import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, tap} from 'rxjs/operators';

import {RecordGQL} from '@services/api/graphql-api/api.record.get';
import {AppStateFacade} from '@base/facades/app-state/app-state.facade';
import {StateFacade} from '@base/facades/state';
import {deepClone} from '@base/utils/object-utils';

export interface ThemeImage {
    path: string;
    name: string;
    type: string;
}

export interface ThemeImages {
    theme: string;
    images: ThemeImageMap;
}

export interface ThemeImageMap {
    [key: string]: ThemeImage;
}

const initialState: ThemeImages = {
    theme: null,
    images: {}
};

let internalState: ThemeImages = deepClone(initialState);

let cachedTheme = null;
let cache$: Observable<any> = null;

@Injectable({
    providedIn: 'root',
})
export class ThemeImagesFacade implements StateFacade {

    protected store = new BehaviorSubject<ThemeImages>(internalState);
    protected state$ = this.store.asObservable();
    protected resourceName = 'themeImages';
    protected frontendName = 'theme-images';
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
    images$ = this.state$.pipe(map(state => state.images), distinctUntilChanged());

    constructor(protected recordGQL: RecordGQL, protected appStateFacade: AppStateFacade) {
    }


    /**
     * Public Api
     */

    /**
     * Clear state
     */
    public clear(): void {
        cachedTheme = null;
        cache$ = null;
        this.updateState(deepClone(initialState));
    }

    /**
     * Change the current theme
     *
     * @param theme
     */
    public changeTheme(theme: string): void {

        this.appStateFacade.updateLoading('change-theme', true);

        this.load(theme).pipe(
            tap(() => this.appStateFacade.updateLoading('change-theme', false))
        ).subscribe();
    }

    /**
     * Returns the currently active image theme
     *
     * @returns string
     */
    public getTheme(): string {
        return internalState.theme;
    }


    /**
     * Initial ThemeImages load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param theme to load
     * @returns Observable<any>
     */
    public load(theme: string): Observable<any> {

        return this.getThemeImages(theme).pipe(
            tap(images => {
                this.updateState({...internalState, images, theme});
            })
        );
    }


    /**
     * Internal API
     */

    /**
     * Update the state
     *
     * @param state
     */
    protected updateState(state: ThemeImages) {
        this.store.next(internalState = state);
    }

    /**
     * Get theme images cached Observable or call the backend
     *
     * @returns Observable<any>
     * @param theme
     */
    protected getThemeImages(theme: string): Observable<any> {

        if (cachedTheme !== theme || cache$ === null) {
            cachedTheme = theme;
            cache$ = this.fetch(theme).pipe(
                shareReplay(1)
            );
        }

        return cache$;
    }

    /**
     * Fetch the theme images from the backend
     *
     * @param theme to load
     * @returns Observable<any>
     */
    protected fetch(theme: string): Observable<any> {

        return this.recordGQL
            .fetch(this.resourceName, `/api/${this.frontendName}/${theme}`, this.fieldsMetadata)
            .pipe(
                map(({data}) => {
                    let images = {};

                    if (data && data.themeImages) {
                        images = data.themeImages.items;
                    }

                    return images;
                })
            );
    }
}
