/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, tap} from 'rxjs/operators';
import {EntityGQL} from '../../services/api/graphql-api/api.entity.get';
import {
    Action,
    ColumnDefinition,
    deepClone,
    FieldDefinitionMap,
    ListViewMeta,
    MassUpdateMeta,
    Panel,
    SearchMeta,
    SubPanelMeta,
    WidgetMetadata
} from 'common';
import {StateStore} from '../state';
import {AppStateStore} from '../app-state/app-state.store';

export interface SummaryTemplates {
    [key: string]: string;
}

export interface RecordViewMetadata {
    topWidget?: WidgetMetadata;
    sidebarWidgets?: WidgetMetadata[];
    actions?: Action[];
    templateMeta?: RecordTemplateMetadata;
    panels?: Panel[];
    summaryTemplates?: SummaryTemplates;
    vardefs?: FieldDefinitionMap;
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
    massUpdate?: MassUpdateMeta;
}

const initialState: Metadata = {
    detailView: {},
    editView: {},
    listView: {} as ListViewMeta,
    search: {} as SearchMeta,
    recordView: {} as RecordViewMetadata,
    subPanel: {} as SubPanelMeta,
    massUpdate: {} as MassUpdateMeta
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
    listViewLineActions$: Observable<Action[]>;
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
        'subPanel',
        'massUpdate'
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
     * @returns any data
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
                return of(metadataCache.value).pipe(shareReplay());
            }
        } else {
            cache[module] = new BehaviorSubject({} as Metadata);
        }

        return this.fetchMetadata(module, types).pipe(
            map((value: Metadata) => {

                Object.keys(loadedTypes).forEach((type) => {
                    if (!value[type] && loadedTypes[type]) {
                        value[type] = loadedTypes[type];
                    }
                });

                return value;
            }),
            shareReplay(),
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
                    this.parseMassUpdateMetadata(data, metadata);

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

    protected parseMassUpdateMetadata(data, metadata: Metadata): void {
        if (data && data.viewDefinition.massUpdate) {
            metadata.massUpdate = data.viewDefinition.massUpdate;
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
            sidebarWidgets: 'sidebarWidgets',
            summaryTemplates: 'summaryTemplates',
            vardefs: 'vardefs'
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
