import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
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

export interface SearchMetaField {
    name?: string;
    type?: string;
    label?: string;
    default?: boolean;
    options?: string;
}

export interface SearchMeta {
    layout: {
        basic?: { [key: string]: SearchMetaField };
        advanced?: { [key: string]: SearchMetaField };
    };
}

export interface Metadata {
    detailView?: any;
    editView?: any;
    listView?: ListViewMeta;
    search?: SearchMeta;
}

const initialState: Metadata = {
    detailView: {},
    editView: {},
    listView: {} as ListViewMeta,
    search: {} as SearchMeta
};

let internalState: Metadata = deepClone(initialState);


export interface MetadataCache {
    [key: string]: BehaviorSubject<Metadata>;
}

const initialCache: MetadataCache = {} as MetadataCache;

let cache: MetadataCache = deepClone(initialCache);

@Injectable({
    providedIn: 'root',
})
export class MetadataStore implements StateStore {

    /**
     * Public long-lived observable streams
     */
    fields$: Observable<Field[]>;
    listMetadata$: Observable<ListViewMeta>;

    protected store = new BehaviorSubject<Metadata>(internalState);
    protected state$ = this.store.asObservable();
    protected resourceName = 'viewDefinition';
    protected fieldsMetadata = {
        fields: [
            'id',
            '_id',
        ]
    };
    protected types = [
        'listView',
        'search'
    ];

    constructor(protected recordGQL: RecordGQL, protected appState: AppStateStore) {
        this.fields$ = this.state$.pipe(map(state => state.listView.fields), distinctUntilChanged());
        this.listMetadata$ = this.state$.pipe(map(state => state.listView), distinctUntilChanged());
    }

    /**
     * Clear state
     */
    public clear(): void {
        Object.keys(cache).forEach(key => {
            cache[key].unsubscribe();
        });
        cache = deepClone(initialCache);
        this.updateState(deepClone(initialState));
    }

    /**
     * Get all metadata types
     *
     * @returns {string[]} metadata types
     */
    public getMetadataTypes(): string[] {
        return this.types;
    }

    /**
     * Initial ListViewMeta load if not cached and update state.
     *
     * @param {string} moduleID to fetch
     * @param {string[]} types to fetch
     * @returns {any} data
     */
    public load(moduleID: string, types: string[]): any {

        if (!types) {
            types = this.getMetadataTypes();
        }

        return this.getMetadata(moduleID, types).pipe(
            tap((metadata: Metadata) => {
                this.updateState(metadata);
            })
        );
    }

    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: Metadata): void {
        this.store.next(internalState = state);
    }

    /**
     * Get ListViewMeta cached Observable or call the backend
     *
     * @param {string} module to fetch
     * @param {string[]} types to retrieve
     * @returns {object} Observable<any>
     */
    protected getMetadata(module: string, types: string[]): Observable<Metadata> {

        let metadataCache: BehaviorSubject<Metadata> = null;
        // check for currently missing and
        const missing = {};
        const loadedTypes = {};

        if (cache[module]) {
            metadataCache = cache[module];

            types.forEach(type => {

                const cached = metadataCache.value;

                if (!cached[type]) {
                    missing[type] = type;
                    return;
                }

                if (Object.keys(cached[type]).length === 0) {
                    missing[type] = type;
                } else {
                    loadedTypes[type] = cached[type];
                }
            });

            if (Object.keys(missing).length === 0) {
                return metadataCache.asObservable();
            }
        } else {
            cache[module] = new BehaviorSubject({} as Metadata);
        }

        return this.fetchMetadata(module, types).pipe(
            map((value: Metadata) => {

                Object.keys(loadedTypes).forEach((type) => {
                    value[type] = loadedTypes[type];
                });

                return value;
            }),
            shareReplay(1),
            tap((value: Metadata) => {
                cache[module].next(value);
            })
        );
    }

    /**
     * Fetch the Metadata from the backend
     *
     * @param {string} module to fetch
     * @param {string[]} types to retrieve
     * @returns {object} Observable<{}>
     */
    protected fetchMetadata(module: string, types: string[]): Observable<Metadata> {

        const fieldsToRetrieve = {
            fields: [
                ...this.fieldsMetadata.fields,
                ...types
            ]
        };

        return this.recordGQL.fetch(this.resourceName, `/api/metadata/view-definitions/${module}`, fieldsToRetrieve)
            .pipe(
                map(({data}) => {

                    const metadata: Metadata = {} as Metadata;

                    if (data && data.viewDefinition.listView) {
                        const listViewMeta: ListViewMeta = {
                            fields: []
                        };

                        data.viewDefinition.listView.forEach((field: Field) => {
                            listViewMeta.fields.push(
                                field
                            );
                        });

                        metadata.listView = listViewMeta;
                    }

                    if (data && data.viewDefinition.search) {
                        metadata.search = data.viewDefinition.search;
                    }

                    return metadata;
                })
            );
    }
}
