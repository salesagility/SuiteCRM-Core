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
import {
    Action,
    AttributeMap,
    deepClone,
    SearchCriteria,
    SearchCriteriaFilter,
    StringMap
} from 'common';
import {Observable, of, Subscription} from 'rxjs';
import {LanguageStore} from '../../store/language/language.store';
import {RecordThreadConfig} from '../record-thread/components/record-thread/record-thread.model';
import {FieldFlexbox} from '../../components/record-flexbox/record-flexbox.model';
import {RecordThreadItemMetadata} from '../record-thread/store/record-thread/record-thread-item.store.model';
import {SystemConfigStore} from '../../store/system-config/system-config.store';

interface ThreadItemMetadataConfig {
    header?: FieldFlexbox;
    body?: FieldFlexbox;
    actions?: Action[];
}

@Component({
    selector: 'scrm-notifications',
    templateUrl: './notifications.component.html',
    styles: []
})
export class NotificationsComponent implements OnInit, OnDestroy {

    panelMode: 'collapsible' | 'closable' | 'none' = 'none';

    options: {
        module: string;
        class?: string;
        maxListHeight?: number;
        direction?: 'asc' | 'desc';
        autoRefreshFrequency?: number;
        item: {
            dynamicClass?: string[];
            itemClass?: string;
            containerClass:string;
            collapsible?: boolean;
            collapseLimit?: number;
            flexDirection?: string;
            layout?: ThreadItemMetadataConfig;
        },
        create?: {
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
    }= {
           //filters$: this.filters$,
           // presetFields$: this.presetFields$,
            module: 'alerts',
            class: 'notifications',
            maxListHeight:  350,
            direction: 'asc',
            autoRefreshFrequency: 600_000, //10 minutes
            create:null,
            item: {
                collapsible: false,
                collapseLimit:  200,
                itemClass: 'notifications-item ',
                containerClass: 'flex-row align-items-start py-2 containerClass ',
                flexDirection:'flex-row',
                layout: {
                    body: {
                        class:'itemContentClass',
                        rows: [
                            {
                                cols: [
                                    {
                                        field: {
                                            name:'target_module',
                                            type:'icon'
                                        },
                                        labelDisplay: 'none',
                                        hideIfEmpty: false,
                                        class: 'font-weight-bold'
                                    }
                                ]
                            },
                            {
                                class:'d-flex flex-column',
                                align: 'start',
                                cols: [
                                    {
                                        field: {
                                            name:'name'
                                        },
                                        labelDisplay: 'none',
                                        labelClass: 'm-0',
                                        display: 'readonly',
                                        hideIfEmpty: true,
                                        class: 'small font-weight-bold text-muted text-uppercase'
                                    },
                                    {
                                        field: {
                                            name: 'description'
                                        },
                                        labelDisplay: 'none',
                                        labelClass: 'm-0',
                                        display: 'readonly',
                                        hideIfEmpty: false,
                                        class: 'font-weight-bold pb-1',
                                    },
                                    {
                                        field: {
                                            name: 'date_entered'
                                        },
                                        labelDisplay: 'none',
                                        labelClass: 'm-0',
                                        display: 'readonly',
                                        hideIfEmpty: true,
                                        class: 'small font-weight-light'
                                    }

                                ]
                            },
                        ]
                    }
                }
            }

    }
    recordThreadConfig: RecordThreadConfig

    filters$: Observable<SearchCriteria>;
    presetFields$: Observable<AttributeMap>;
    protected subs: Subscription[] = [];

    constructor(
        protected language: LanguageStore,
        protected sytemConfig: SystemConfigStore
    ) {}

    ngOnInit(): void {
        this.recordThreadConfig = this.getConfig();
    }

    ngOnDestroy(): void {
        //this.subs.forEach(sub => sub.unsubscribe());
    }

    getConfig(): RecordThreadConfig {

        const config = {
            filters$: of({orderBy:'date_entered', sortOrder:'asc'} as SearchCriteria),
            //presetFields$: this.presetFields$,
            module: this.options.module,
            klass: this.options.class || '',
            maxListHeight: this.options.maxListHeight ?? 350,
            direction: this.options.direction || 'asc',
            autoRefreshFrequency: this.options.autoRefreshFrequency || 0,
            create: false,
            itemConfig: {
                collapsible: this.options.item.collapsible || false,
                collapseLimit: this.options.item.collapseLimit || null,
                klass: this.options.item.itemClass || '',
                dynamicClass: this.options.item.dynamicClass || [],
                containerClass: this.options.item.containerClass || '',
                flexDirection: this.options.item.flexDirection || '',
                metadata: {} as RecordThreadItemMetadata
            },
        } as RecordThreadConfig;

        this.setupItemMetadata(config.itemConfig.metadata, this.options.item.layout);
        //this.setupItemMetadata(config.createConfig.metadata, this.options.create.layout);
        return config;
    }

    protected setupItemMetadata(metadata: RecordThreadItemMetadata, config: ThreadItemMetadataConfig) {
        if (config && config.header) {
            metadata.headerLayout = deepClone(config.header);
        }

        if (config && config.body) {
            metadata.bodyLayout = deepClone(config.body);
        }

        if (config && config.actions) {
            metadata.actions = deepClone(config.actions);
        }
    }


}
