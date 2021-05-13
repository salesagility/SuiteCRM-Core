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
import {Observable, of} from 'rxjs';
import {catchError, finalize, shareReplay} from 'rxjs/operators';
import {Params} from '@angular/router';
import {StatisticsBatch} from '../../../../store/statistics/statistics-batch.service';
import {RecordViewStore} from '../../../record/store/record-view/record-view.store';
import {RecordFetchGQL} from '../../../../store/record/graphql/api.record.get';
import {RecordSaveGQL} from '../../../../store/record/graphql/api.record.save';
import {AppStateStore} from '../../../../store/app-state/app-state.store';
import {LanguageStore} from '../../../../store/language/language.store';
import {NavigationStore} from '../../../../store/navigation/navigation.store';
import {ModuleNavigation} from '../../../../services/navigation/module-navigation/module-navigation.service';
import {MetadataStore} from '../../../../store/metadata/metadata.store.service';
import {RecordManager} from '../../../../services/record/record.manager';
import {LocalStorageService} from '../../../../services/local-storage/local-storage.service';
import {SubpanelStoreFactory} from '../../../../containers/subpanel/store/subpanel/subpanel.store.factory';
import {AuthService} from '../../../../services/auth/auth.service';
import {MessageService} from '../../../../services/message/message.service';
import {Record, ViewMode} from 'common';
import {RecordStoreFactory} from '../../../../store/record/record.store.factory';

@Injectable()
export class CreateViewStore extends RecordViewStore {

    constructor(
        protected recordFetchGQL: RecordFetchGQL,
        protected recordSaveGQL: RecordSaveGQL,
        protected appStateStore: AppStateStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected moduleNavigation: ModuleNavigation,
        protected metadataStore: MetadataStore,
        protected localStorage: LocalStorageService,
        protected message: MessageService,
        protected subpanelFactory: SubpanelStoreFactory,
        protected recordManager: RecordManager,
        protected statisticsBatch: StatisticsBatch,
        protected auth: AuthService,
        protected recordStoreFactory: RecordStoreFactory
    ) {
        super(
            recordFetchGQL,
            recordSaveGQL,
            appStateStore,
            languageStore,
            navigationStore,
            moduleNavigation,
            metadataStore,
            localStorage,
            message,
            subpanelFactory,
            recordManager,
            statisticsBatch,
            recordStoreFactory
        );
    }

    /**
     * Initial record load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @param {string} recordID to use
     * @param {string} mode to use
     * @param {object} params to set
     * @returns {object} Observable<any>
     */
    public init(module: string, recordID: string, mode = 'detail' as ViewMode, params: Params = {}): Observable<Record> {
        this.internalState.module = module;
        this.internalState.recordID = recordID;
        this.setMode(mode);
        this.parseParams(params);
        this.calculateShowWidgets();
        this.showTopWidget = false;
        this.showSubpanels = false;

        this.initRecord(params);

        return this.load();
    }

    save(): Observable<Record> {
        this.appStateStore.updateLoading(`${this.internalState.module}-record-save-new`, true);

        return this.recordStore.save().pipe(
            catchError(() => {
                this.message.addDangerMessageByKey('LBL_ERROR_SAVING');
                return of({} as Record);
            }),
            finalize(() => {
                this.setMode('detail' as ViewMode);
                this.appStateStore.updateLoading(`${this.internalState.module}-record-save-new`, false);
            })
        );
    }

    /**
     * Init record using params
     *
     * @param {object} params queryParams
     */
    public initRecord(params: Params = {}): void {
        const user = this.auth.getCurrentUser();
        const blankRecord = {
            id: '',
            type: '',
            module: this.internalState.module,
            /* eslint-disable camelcase,@typescript-eslint/camelcase */
            attributes: {
                assigned_user_id: user.id,
                assigned_user_name: {
                    id: user.id,
                    user_name: user.userName
                }
            }
            /* eslint-enable camelcase,@typescript-eslint/camelcase */
        } as Record;

        this.recordManager.injectParamFields(params, blankRecord, this.getVardefs());

        this.recordStore.init(blankRecord);
    }

    /**
     * Load / reload record using current pagination and criteria
     *
     * @returns {object} Observable<RecordViewState>
     */
    public load(): Observable<Record> {
        return of(this.recordStore.getBaseRecord()).pipe(shareReplay());
    }

    /**
     * Calculate if widgets are to display
     */
    protected calculateShowWidgets(): void {
        const show = false;
        this.showSidebarWidgets = show;
        this.widgets = show;
    }
}
