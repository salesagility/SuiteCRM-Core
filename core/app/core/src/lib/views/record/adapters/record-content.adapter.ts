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

import {combineLatestWith, Observable, Subscription} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Action} from '../../../common/actions/action.model';
import {ViewMode} from '../../../common/views/view.model';
import {Record} from '../../../common/record/record.model';
import {Panel} from '../../../common/metadata/metadata.model';
import {MetadataStore, RecordViewMetadata} from '../../../store/metadata/metadata.store.service';
import {RecordContentConfig, RecordContentDataSource} from '../../../components/record-content/record-content.model';
import {RecordActionManager} from '../actions/record-action-manager.service';
import {RecordActionData} from '../actions/record.action';
import {LanguageStore} from '../../../store/language/language.store';
import {RecordViewStore} from '../store/record-view/record-view.store';
import {PanelLogicManager} from '../../../components/panel-logic/panel-logic.manager';
import {RecordValidationHandler} from "../../../services/record/validation/record-validation.handler";

@Injectable()
export class RecordContentAdapter implements RecordContentDataSource {
    inlineEdit: true;

    protected fieldSubs: Subscription[] = [];
    protected recordValidationHandler: RecordValidationHandler;

    constructor(
        protected store: RecordViewStore,
        protected metadata: MetadataStore,
        protected language: LanguageStore,
        protected actions: RecordActionManager,
        protected logicManager: PanelLogicManager
    ) {
        this.recordValidationHandler = inject(RecordValidationHandler);
    }

    getEditAction(): void {
        const data: RecordActionData = {
            store: this.store
        };

        const action = {
            key: 'edit'
        } as Action;

        this.actions.run(action, this.store.getMode(), data);
    }

    getDisplayConfig(): Observable<RecordContentConfig> {

        return this.metadata.recordViewMetadata$.pipe(
            combineLatestWith(this.store.mode$),
            map(([meta, mode]: [RecordViewMetadata, ViewMode]) => {
                const layout = this.getLayout(meta);
                const maxColumns = meta.templateMeta.maxColumns || 2;
                const tabDefs = meta.templateMeta.tabDefs;

                return {
                    layout,
                    mode,
                    maxColumns,
                    tabDefs
                } as RecordContentConfig;
            })
        );
    }

    getPanels(): Observable<Panel[]> {
        return this.store.panels$;
    }

    getRecord(): Observable<Record> {
        return this.store.stagingRecord$.pipe(
            combineLatestWith(this.store.mode$),
            map(([record, mode]: [Record, ViewMode]) => {
                if (mode === 'edit' || mode === 'create') {
                    this.recordValidationHandler.initValidators(record);
                } else {
                    this.recordValidationHandler.resetValidators(record);
                }

                if (record.formGroup) {
                    record.formGroup.enable();
                }
                return record;
            })
        );
    }

    protected getLayout(recordMeta: RecordViewMetadata): string {
        let layout = 'panels';
        if (recordMeta.templateMeta.useTabs) {
            layout = 'tabs';
        }

        return layout;
    }

    clean(): void {
        this.fieldSubs.forEach(sub => sub.unsubscribe());
    }
}
