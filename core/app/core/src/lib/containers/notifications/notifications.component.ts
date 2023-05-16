/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2023 SalesAgility Ltd.
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

import {Component, OnInit} from '@angular/core';
import {deepClone, SearchCriteria} from 'common';
import {Observable, of} from 'rxjs';
import {LanguageStore} from '../../store/language/language.store';
import {
    RecordThreadConfig,
    ThreadItemMetadataConfig
} from '../record-thread/components/record-thread/record-thread.model';
import {RecordThreadItemMetadata} from '../record-thread/store/record-thread/record-thread-item.store.model';
import {SystemConfigStore} from '../../store/system-config/system-config.store';
import {RecordThreadStoreFactory} from "../record-thread/store/record-thread/record-thread.store.factory";
import {RecordThreadStore} from "../record-thread/store/record-thread/record-thread.store";
import {AppStateStore} from "../../store/app-state/app-state.store";
import {MessageService} from "../../services/message/message.service";
import {NotificationsService} from './services/notifications.service';
import {DynamicLabelService} from "../../services/language/dynamic-label.service";

@Component({
    selector: 'scrm-notifications',
    templateUrl: './notifications.component.html',
    styles: []
})
export class NotificationsComponent implements OnInit {

    recordThreadConfig: RecordThreadConfig;
    filters$: Observable<SearchCriteria>;
    store: RecordThreadStore;
    options: any;

    constructor(
        protected language: LanguageStore,
        protected systemConfig: SystemConfigStore,
        protected storeFactory: RecordThreadStoreFactory,
        protected appStateStore: AppStateStore,
        protected message: MessageService,
        protected notificationService: NotificationsService,
        protected dynamicLabels: DynamicLabelService
    ) {
    }

    ngOnInit(): void {
        this.options = this.notificationService.getOptions();
        this.recordThreadConfig = this.getConfig();
    }

    getConfig(): RecordThreadConfig {

        const config = {
            filters$: of({
                orderBy: this?.options?.filters?.orderBy ?? 'date_entered',
                sortOrder: this?.options?.filters?.sortOrder ?? 'asc',
                preset: {type: 'alerts'}
            } as SearchCriteria),
            module: this.options.module,
            klass: this.options.class ?? '',
            maxListHeight: this.options.maxListHeight ?? 350,
            direction: this.options.direction || 'asc',
            autoRefreshFrequency: this.options.autoRefreshFrequency || 0,
            autoRefreshDeviationMin: this.options.autoRefreshDeviationMin ?? 0,
            autoRefreshDeviationMax: this.options.autoRefreshDeviationMax ?? 0,
            onRefresh: () => {
                this.notificationService.onRefresh(this.store, this.appStateStore);
            },
            onLoadMore: () => {
                this.notificationService.onLoadMore(this.appStateStore);
            },
            loadMorePosition: this.options?.loadMorePosition ?? '',
            create: false,
            listActionsClass: this.options?.listActionsClass ?? '',
            listActionsButtonClass: this.options?.listActionsButtonClass ?? '',
            listActionsButtonGroupClass: this.options?.listActionsButtonGroupClass ?? '',
            pageSize: this.options?.pageSize ?? '',
            showNoDataMessage: this.options?.showNoDataMessage,
            noDataLabel: this.options?.noDataLabel,
        } as RecordThreadConfig;

        this.notificationService.setupListActions(config, this.options);
        this.notificationService.setupItemConfig(config, this.options);

        config.store = this.appStateStore.getNotificationStore();
        this.store = this.appStateStore.getNotificationStore();

        return config;
    }

    protected setupItemMetadata(metadata: RecordThreadItemMetadata, config: ThreadItemMetadataConfig): void {
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
