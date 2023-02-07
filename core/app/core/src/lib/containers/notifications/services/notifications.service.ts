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

import {Injectable} from '@angular/core';
import {RecordThreadStore} from '../../record-thread/store/record-thread/record-thread.store';
import {SystemConfigStore} from '../../../store/system-config/system-config.store';
import {deepClone, Field, Record} from 'common';
import {RecordThreadItemMetadata} from '../../record-thread/store/record-thread/record-thread-item.store.model';
import {
    RecordThreadConfig,
    ThreadItemMetadataConfig
} from '../../record-thread/components/record-thread/record-thread.model';
import {RecordThreadStoreFactory} from '../../record-thread/store/record-thread/record-thread.store.factory';
import {RecordThreadItemConfig} from '../../record-thread/components/record-thread-item/record-thread-item.model';
import {Process, ProcessService} from '../../../services/process/process.service';
import {catchError, tap} from 'rxjs/operators';
import {AsyncActionInput} from '../../../services/process/processes/async-action/async-action';
import {MessageService} from '../../../services/message/message.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {

    constructor(
        protected systemConfig: SystemConfigStore,
        protected storeFactory: RecordThreadStoreFactory,
        protected processService: ProcessService,
        protected messages: MessageService
    ) {
    }

    getOptions(): any {
        const ui = this.systemConfig.getConfigValue('ui');
        const options = ui?.notifications ?? null;
        return options;
    }

    initStore(): RecordThreadStore {
        const options = this.getOptions();

        const config = {} as RecordThreadConfig;
        this.setupListActions(config, options);
        this.setupItemConfig(config, options);

        const store = this.storeFactory.create();
        store.setItemMetadata(config.itemConfig.metadata);
        store.setListMetadata({actions: config.listActions});
        store.init(options.module, false);

        return store;
    }

    setupListActions(config: RecordThreadConfig, options): void {
        config.listActions = options?.listActions ?? [];
    }

    setupItemConfig(config: RecordThreadConfig, options): void {
        config.itemConfig = {
            collapsible: options?.item?.collapsible ?? false,
            collapseLimit: options?.item?.collapseLimit ?? null,
            klass: options?.item?.itemClass ?? '',
            buttonClass: options?.item?.buttonClass ?? '',
            buttonGroupClass: options?.item?.buttonGroupClass ?? '',
            dynamicClass: options?.item?.dynamicClass ?? [],
            containerClass: options?.item?.containerClass ?? '',
            flexDirection: options?.item?.flexDirection ?? '',
            metadata: {} as RecordThreadItemMetadata,
        } as RecordThreadItemConfig;

        this.setupItemMetadata(config.itemConfig.metadata, options.item.layout);
    }

    setupItemMetadata(metadata: RecordThreadItemMetadata, config: ThreadItemMetadataConfig): void {
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

    /**
     * Send notification mark-as-read request
     *
     * @param {object} store to use
     * @returns {object} Observable<Process>
     */
    markNotificationsAsRead(store: RecordThreadStore): Observable<Process> {
        const options = {
            action: 'record-thread-list-mark-as-read',
            module: store.module ?? 'alerts',
            ids: store.getRecordIds(),
        } as AsyncActionInput;


        return this.processService
            .submit('record-thread-list-mark-as-read', options)
            .pipe(
                tap((process: Process) => {
                    let handler = 'addSuccessMessageByKey';
                    if (process.status === 'error') {
                        handler = 'addDangerMessageByKey';
                    }

                    if (process.messages) {
                        process.messages.forEach(message => {
                            this.messages[handler](message);
                        });
                    }

                    store.getItemStores().forEach(notification => {
                        const staging = notification?.recordStore?.getStaging() ?? {} as Record;
                        const field = staging?.fields['is_read'] ?? null as Field;
                        if (field == null) {
                            return;
                        }
                        field.value = 'true';
                    });
                }),
                catchError(err => {
                    this.messages.addDangerMessageByKey('ERR_NOTIFICATIONS_MARK_AS_READ');
                    throw err;
                }),
            );
    }
}
