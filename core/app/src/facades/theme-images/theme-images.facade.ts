import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, distinctUntilChanged, tap, shareReplay} from 'rxjs/operators';

import {RecordGQL} from '@services/api/graphql-api/api.record.get';
import {AppStateFacade} from '@base/facades/app-state/app-state.facade';

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

let internalState: ThemeImages = {
    theme: null,
    images: {}
};

let cachedTheme = null;
let cache$: Observable<any> = null;

@Injectable({
    providedIn: 'root',
})
export class ThemeImagesFacade {

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
     * Change the current theme
     *
     * @param theme
     */
    public changeTheme(theme: string): void {

        this.appStateFacade.updateLoading(true);

        this.load(theme).pipe(
            tap(() => this.appStateFacade.updateLoading(false))
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
     * @return Observable<any>
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
