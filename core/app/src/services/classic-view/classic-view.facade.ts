import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ClassicViewGQL} from './api.classic-view.get';

export interface ClassicView {
    id: string;
    _id: string;
    action: string;
    record: string;
    html: string;
}

@Injectable({
    providedIn: 'root',
})
export class ClassicViewStore {

    protected fieldsMetadata = {
        fields: [
            'id',
            '_id',
            'action',
            'record',
            'html'
        ]
    };

    constructor(private classicViewGQL: ClassicViewGQL) {
    }

    /**
     * Public Api
     */

    /**
     * Load ClassicView from the backend.
     * Returns observable to be used in resolver if needed
     *
     * @returns Observable<any>
     */
    public load($module: string, $params: { [key: string]: string }): Observable<any> {
        return this.fetch($module, $params);
    }

    /**
     * Internal API
     */


    /**
     * Fetch the classic view from the backend
     *
     * @returns Observable<any>
     */
    protected fetch($module: string, $params: { [key: string]: string }): Observable<ClassicView> {

        return this.classicViewGQL.fetch($module, $params, this.fieldsMetadata)
            .pipe(map(({data}) => {
                const classicView: ClassicView = {
                    id: null,
                    _id: null,
                    action: null,
                    record: null,
                    html: null,
                };

                if (data.getClassicView) {
                    return data.getClassicView;
                }

                return classicView;
            }));
    }

}
