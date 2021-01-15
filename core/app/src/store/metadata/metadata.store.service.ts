import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, tap} from 'rxjs/operators';
import {EntityGQL} from '@services/api/graphql-api/api.entity.get';
import {deepClone} from '@base/app-common/utils/object-utils';
import {StateStore} from '@base/store/state';
import {AppStateStore} from '@store/app-state/app-state.store';
import {Panel} from '@app-common/metadata/metadata.model';
import {Action} from '@app-common/actions/action.model';
import {ColumnDefinition, ListViewMeta, SearchMeta} from '@app-common/metadata/list.metadata.model';
import {LineAction} from '@app-common/actions/line-action.model';
import {SubPanelMeta} from '@app-common/metadata/subpanel.metadata.model';
import {WidgetMetadata} from '@app-common/metadata/widget.metadata';

export interface RecordViewMetadata {
    topWidget?: WidgetMetadata;
    sidebarWidgets?: WidgetMetadata[];
    actions: Action[];
    templateMeta: RecordTemplateMetadata;
    panels: Panel[];
}

export interface RecordTemplateMetadata {
    maxColumns: number;
    useTabs: boolean;
    tabDefs: TabDefinitions;
}

export interface TabDefinitions {
    [key: string]: TabDefinition;
}

export interface TabDefinition {
    newTab: boolean;
    panelDefault: 'expanded' | 'collapsed';
}


export interface Metadata {
    detailView?: any;
    editView?: any;
    listView?: ListViewMeta;
    search?: SearchMeta;
    recordView?: RecordViewMetadata;
    subPanel?: SubPanelMeta;
}

const initialState: Metadata = {
    detailView: {},
    editView: {},
    listView: {} as ListViewMeta,
    search: {} as SearchMeta,
    recordView: {} as RecordViewMetadata,
    subPanel: {} as SubPanelMeta
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
    listViewColumns$: Observable<ColumnDefinition[]>;
    listViewLineActions$: Observable<LineAction[]>;
    listMetadata$: Observable<ListViewMeta>;
    searchMetadata$: Observable<SearchMeta>;
    recordViewMetadata$: Observable<RecordViewMetadata>;
    metadata$: Observable<Metadata>;
    subPanelMetadata$: Observable<SubPanelMeta>;

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
        'search',
        'recordView',
        'subPanel'
    ];

    constructor(protected recordGQL: EntityGQL, protected appState: AppStateStore) {
        this.listViewColumns$ = this.state$.pipe(map(state => state.listView.fields), distinctUntilChanged());
        this.listViewLineActions$ = this.state$.pipe(map(state => state.listView.lineActions), distinctUntilChanged());
        this.listMetadata$ = this.state$.pipe(map(state => state.listView), distinctUntilChanged());
        this.searchMetadata$ = this.state$.pipe(map(state => state.search), distinctUntilChanged());
        this.recordViewMetadata$ = this.state$.pipe(map(state => state.recordView), distinctUntilChanged());
        this.subPanelMetadata$ = this.state$.pipe(map(state => state.subPanel), distinctUntilChanged());
        this.metadata$ = this.state$;
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

    public clearAuthBased(): void {
        this.clear();
    }

    /**
     * Get all metadata types
     *
     * @returns {string[]} metadata types
     */
    public getMetadataTypes(): string[] {
        return this.types;
    }

    public get(): Metadata {
        return internalState;
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
     * Get ListViewMeta cached Observable or call the backend
     *
     * @param {string} module to fetch
     * @param {string[]} types to retrieve
     * @returns {object} Observable<any>
     */
    public getMetadata(module: string, types: string[] = null): Observable<Metadata> {

        if (types === null) {
            types = this.getMetadataTypes();
        }

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
                return of(metadataCache.value).pipe(shareReplay(1));
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
     * Internal API
     */

    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: Metadata): void {
        this.store.next(internalState = state);
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
                    this.parseListViewMetadata(data, metadata);
                    this.parseSearchMetadata(data, metadata);
                    this.parseRecordViewMetadata(data, metadata);
                    this.parseSubPanelMetadata(data, metadata);

                    return metadata;
                })
            );
    }

    protected parseListViewMetadata(data, metadata: Metadata): void {

        if (!data || !data.viewDefinition.listView) {
            return;
        }

        const listViewMeta: ListViewMeta = {
            fields: [],
            bulkActions: {},
            lineActions: [],
            chartTypes: {},
            filters: []
        };

        if (data.viewDefinition.listView.columns) {
            data.viewDefinition.listView.columns.forEach((field: ColumnDefinition) => {
                listViewMeta.fields.push(
                    field
                );
            });
        }

        const entries = {
            bulkActions: 'bulkActions',
            lineActions: 'lineActions',
            sidebarWidgets: 'sidebarWidgets',
            availableFilters: 'filters'
        };

        this.addDefinedMeta(listViewMeta, data.viewDefinition.listView, entries);

        metadata.listView = listViewMeta;
    }

    protected parseSearchMetadata(data, metadata: Metadata): void {
        if (data && data.viewDefinition.search) {
            metadata.search = data.viewDefinition.search;
        }
    }

    protected parseSubPanelMetadata(data, metadata: Metadata): void {
        if (data && data.viewDefinition.subPanel) {
            metadata.subPanel = data.viewDefinition.subPanel;
        }
    }

    protected parseRecordViewMetadata(data, metadata: Metadata): void {
        if (!data || !data.viewDefinition.recordView) {
            return;
        }

        const recordViewMeta: RecordViewMetadata = {
            actions: [] as Action[],
            templateMeta: {} as RecordTemplateMetadata,
            panels: []
        };

        const receivedMeta = data.viewDefinition.recordView;
        const entries = {
            templateMeta: 'templateMeta',
            actions: 'actions',
            panels: 'panels',
            topWidget: 'topWidget',
            sidebarWidgets: 'sidebarWidgets'
        };

        this.addDefinedMeta(recordViewMeta, receivedMeta, entries);

        metadata.recordView = recordViewMeta;
    }

    protected addDefinedMeta(
        metadata: { [key: string]: any },
        received: { [key: string]: any },
        keyMap: { [key: string]: string }
    ): void {
        Object.keys(keyMap).forEach(dataKey => {
            const metadataKey = keyMap[dataKey];
            if (received[dataKey]) {
                metadata[metadataKey] = received[dataKey];
            }
        });
    }
}
