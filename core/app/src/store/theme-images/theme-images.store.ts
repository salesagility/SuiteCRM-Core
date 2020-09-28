import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, tap} from 'rxjs/operators';

import {EntityGQL} from '@services/api/graphql-api/api.entity.get';
import {AppStateStore} from '@store/app-state/app-state.store';
import {StateStore} from '@base/store/state';
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
export class ThemeImagesStore implements StateStore {

    /**
     * Public long-lived observable streams
     */
    images$: Observable<ThemeImageMap>;

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

    constructor(protected recordGQL: EntityGQL, protected appStateStore: AppStateStore) {
        this.images$ = this.state$.pipe(map(state => state.images), distinctUntilChanged());
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

    public clearAuthBased(): void {
    }

    /**
     * Change the current theme
     *
     * @param {string} theme to set
     */
    public changeTheme(theme: string): void {

        this.appStateStore.updateLoading('change-theme', true);

        this.load(theme).pipe(
            tap(() => this.appStateStore.updateLoading('change-theme', false))
        ).subscribe();
    }

    /**
     * Returns the currently active image theme
     *
     * @returns {string} the theme
     */
    public getTheme(): string {
        return internalState.theme;
    }


    /**
     * Initial ThemeImages load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} theme to load
     * @returns {object} Observable<any>
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
     * @param {object} state to set
     */
    protected updateState(state: ThemeImages): void {
        this.store.next(internalState = state);
    }

    /**
     * Get theme images cached Observable or call the backend
     *
     * @param {string} theme to retrieve
     * @returns {object} Observable<any>
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
     * @param {string} theme to load
     * @returns {object} Observable<any>
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
