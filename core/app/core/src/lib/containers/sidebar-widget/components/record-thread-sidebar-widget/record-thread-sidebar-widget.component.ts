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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {AttributeMap, deepClone, Record, SearchCriteria, SearchCriteriaFilter, StringMap, ViewContext} from 'common';
import {Observable, of, Subscription} from 'rxjs';
import {LanguageStore} from '../../../../store/language/language.store';
import {BaseWidgetComponent} from '../../../widgets/base-widget.model';
import {distinctUntilChanged, filter, map, shareReplay} from 'rxjs/operators';
import {RecordThreadConfig} from '../../../record-thread/components/record-thread/record-thread.model';
import {FieldFlexbox} from '../../../../components/record-flexbox/record-flexbox.model';
import {RecordThreadItemMetadata} from '../../../record-thread/store/record-thread/record-thread-item.store.model';

interface ThreadItemMetadataConfig {
    header?: FieldFlexbox;
    body?: FieldFlexbox;
}

@Component({
    selector: 'scrm-record-thread-sidebar-widget',
    templateUrl: './record-thread-sidebar-widget.component.html',
    styles: []
})
export class RecordThreadSidebarWidgetComponent extends BaseWidgetComponent implements OnInit, OnDestroy {


    options: {
        module: string;
        class?: string;
        maxListHeight?: number;
        direction?: 'asc' | 'desc';
        item: {
            dynamicClass?: string[];
            itemClass?: string;
            collapsible?: boolean;
            collapseLimit?: number;
            layout?: ThreadItemMetadataConfig;
        },
        create: {
            presetFields?: {
                parentValues?: StringMap;
                static?: AttributeMap;
            },
            layout?: ThreadItemMetadataConfig;
        },
        filters?: {
            parentFilters?: StringMap;
            static?: SearchCriteriaFilter;
            orderBy?: string;
            sortOrder?: string;
        };
    };
    recordThreadConfig: RecordThreadConfig;

    filters$: Observable<SearchCriteria>;
    presetFields$: Observable<AttributeMap>;
    protected subs: Subscription[] = [];

    constructor(protected language: LanguageStore
    ) {
        super();
    }

    ngOnInit(): void {

        const options = this.config.options || {};
        this.options = options.recordThread || null;

        if (!this.options) {
            return;
        }

        this.initFilters$();
        this.initPresetFields$();

        if (this.context$ && this.context$.subscribe()) {
            this.subs.push(this.context$.subscribe((context: ViewContext) => {
                this.context = context;
            }));
        }

        this.recordThreadConfig = this.getConfig();
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    getHeaderLabel(): string {
        return this.getLabel(this.config.labelKey) || '';
    }

    getLabel(key: string): string {
        const context = this.context || {} as ViewContext;
        const module = context.module || '';

        return this.language.getFieldLabel(key, module);
    }

    getConfig(): RecordThreadConfig {

        const config = {
            filters$: this.filters$,
            presetFields$: this.presetFields$,
            module: this.options.module,
            klass: this.options.class || '',
            maxListHeight: this.options.maxListHeight || 350,
            direction: this.options.direction || 'asc',
            create: !!this.options.create,
            itemConfig: {
                collapsible: this.options.item.collapsible || false,
                collapseLimit: this.options.item.collapseLimit || null,
                klass: this.options.item.itemClass || '',
                dynamicClass: this.options.item.dynamicClass || [],
                metadata: {} as RecordThreadItemMetadata
            },
            createConfig: {
                collapsible: false,
                metadata: {} as RecordThreadItemMetadata
            },
        } as RecordThreadConfig;

        this.setupItemMetadata(config.itemConfig.metadata, this.options.item.layout);
        this.setupItemMetadata(config.createConfig.metadata, this.options.create.layout);

        return config;
    }

    protected setupItemMetadata(metadata: RecordThreadItemMetadata, config: ThreadItemMetadataConfig) {
        if (config && config.header) {
            metadata.headerLayout = deepClone(config.header);
        }

        if (config && config.body) {
            metadata.bodyLayout = deepClone(config.body);
        }
    }

    protected initFilters$() {
        if (!this.options || !this.options.filters || !this.context$) {
            return;
        }

        const parentFilters = this.options.filters.parentFilters || {} as StringMap;

        let context$ = of({}).pipe(shareReplay());

        if (Object.keys(parentFilters).length > 0) {
            context$ = this.context$.pipe(
                filter(context => {
                    const record = (context && context.record) || {} as Record;
                    return !!(record.attributes && Object.keys(record.attributes).length);
                })
            );
        }

        this.filters$ = context$.pipe(
            map(context => {
                const filters = {filters: {} as SearchCriteriaFilter} as SearchCriteria;

                this.initParentFilters(context, filters);

                const staticFilters = this.options.filters.static || {} as SearchCriteriaFilter;

                filters.filters = {
                    ...filters.filters,
                    ...staticFilters
                };

                if (this.options.filters.orderBy) {
                    filters.orderBy = this.options.filters.orderBy;
                }

                if (this.options.filters.sortOrder) {
                    filters.sortOrder = this.options.filters.sortOrder;
                }

                return filters;
            }),
            distinctUntilChanged()
        );
    }

    protected initPresetFields$() {
        if (!this.options || !this.options.create || !this.options.create.presetFields || !this.context$) {
            return;
        }


        this.presetFields$ = this.context$.pipe(
            map(context => {

                const parentValues = this.initParentValues(context);

                const staticValues = this.options.create.presetFields.static || {} as AttributeMap;
                return {
                    ...parentValues,
                    ...staticValues
                };
            }),
            distinctUntilChanged()
        );
    }

    protected initParentFilters(context, filters) {

        const parentFilters = this.options.filters.parentFilters || {} as StringMap;
        if (!context || !context.record || !parentFilters) {
            return;
        }

        Object.keys(parentFilters).forEach(parentField => {
            const field = parentFilters[parentField];
            const value = context.record.attributes[parentField] || '';

            if (!value) {
                return;
            }

            filters.filters[field] = {
                field: parentFilters,
                operator: '=',
                values: [value],
            }
        });
    }

    protected initParentValues(context: ViewContext): AttributeMap {

        const parentValues = this.options.create.presetFields.parentValues || {} as StringMap;
        if (!context || !context.record || !parentValues) {
            return;
        }

        const attributes = {} as AttributeMap;

        Object.keys(parentValues).forEach(parentField => {
            const field = parentValues[parentField];
            const value = context.record.attributes[parentField] || '';

            if (!value) {
                return;
            }

            attributes[field] = value;
        });

        return attributes;
    }

}
