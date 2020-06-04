import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, tap} from 'rxjs/operators';
import {RecordGQL} from '@services/api/graphql-api/api.record.get';
import {deepClone} from '@base/utils/object-utils';
import {StateStore} from '@base/store/state';
import {AppStateStore} from '@store/app-state/app-state.store';

export interface ListViewMeta {
    fields: Field[];
}

export interface Field {
    fieldName: string;
    width: string;
    label: string;
    link: boolean;
    default: boolean;
    module: string;
    id: string;
    sortable: boolean;
}

const initialState: ListViewMeta = {
    fields: []
};

let internalState: ListViewMeta = deepClone(initialState);

let cache$: Observable<any> = null;
let loadedModule: string;

@Injectable({
    providedIn: 'root',
})
export class ListViewMetaStore implements StateStore {
    protected store = new BehaviorSubject<ListViewMeta>(internalState);
    protected state$ = this.store.asObservable();
    protected resourceName = 'viewDefinition';
    protected fieldsMetadata = {
        fields: [
            'id',
            '_id',
            'listView'
        ]
    };

    /**
     * Public long-lived observable streams
     */
    fields$ = this.state$.pipe(map(state => state.fields), distinctUntilChanged());


    /**
     * ViewModel that resolves once all the data is ready (or updated)...
     */
    vm$: Observable<ListViewMeta> = combineLatest(
        [
            this.fields$,
        ])
        .pipe(
            map((
                [
                    fields,
                ]) => ({fields})
            )
        );

    constructor(protected recordGQL: RecordGQL, protected appState: AppStateStore) {
    }


    /**
     * Clear state
     */
    public clear(): void {
        loadedModule = '';
        cache$ = null;
        this.updateState(deepClone(initialState));
    }


    /**
     * Initial ListViewMeta load if not cached and update state.
     *
     * @param {string} module to fetch
     */
    public load(moduleID: string): any {
        return this.getListViewMeta(moduleID).pipe(
            tap(listViewMeta => {
                loadedModule = moduleID;
                this.updateState({
                    ...internalState,
                    fields: listViewMeta.fields,
                });
            })
        )
    }

    /**
     * Update the state
     *
     * @param {{}} state to set
     */
    protected updateState(state: ListViewMeta): void {
        this.store.next(internalState = state);
    }

    /**
     * Get ListViewMeta cached Observable or call the backend
     *
     * @param {string} module to fetch
     * @returns {{}} Observable<any>
     */
    protected getListViewMeta(moduleID: string): Observable<any> {
        if (cache$ == null || loadedModule != moduleID) {
            cache$ = this.fetchViewDef(moduleID).pipe(
                shareReplay(1)
            );
        }

        return cache$;
    }

    /**
     * Fetch the ListViewMeta from the backend
     *
     * @param {string} module to fetch
     * @returns {{}} Observable<{}>
     */
    protected fetchViewDef(moduleID: string): Observable<{}> {
        return this.recordGQL.fetch(this.resourceName, `/api/metadata/view-definitions/${moduleID}`, this.fieldsMetadata)
            .pipe(
                map(({data}) => {
                    let listViewMeta: ListViewMeta = {
                        fields: []
                    };

                    if (data && data.viewDefinition.listView) {
                        data.viewDefinition.listView.forEach((field: Field) => {
                            listViewMeta.fields.push(
                                field
                            )
                        });
                    }

                    return listViewMeta;
                })
            );
    }
}
