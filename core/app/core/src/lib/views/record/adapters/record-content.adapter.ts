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

import {combineLatest, Observable, Subscription} from 'rxjs';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Action, Panel, Record} from 'common';
import {MetadataStore, RecordViewMetadata} from '../../../store/metadata/metadata.store.service';
import {RecordContentConfig, RecordContentDataSource} from '../../../components/record-content/record-content.model';
import {RecordActionManager} from '../actions/record-action-manager.service';
import {RecordActionData} from '../actions/record.action';
import {LanguageStore} from '../../../store/language/language.store';
import {RecordViewStore} from '../store/record-view/record-view.store';
import {PanelLogicManager} from '../../../components/panel-logic/panel-logic.manager';

@Injectable()
export class RecordContentAdapter implements RecordContentDataSource {
    inlineEdit: true;

    protected fieldSubs: Subscription[] = [];

    constructor(
        protected store: RecordViewStore,
        protected metadata: MetadataStore,
        protected language: LanguageStore,
        protected actions: RecordActionManager,
        protected logicManager: PanelLogicManager
    ) {
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

        return combineLatest(
            [this.metadata.recordViewMetadata$, this.store.mode$]
        ).pipe(
            map(([meta, mode]) => {
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
        return combineLatest([this.store.stagingRecord$, this.store.mode$]).pipe(
            map(([record, mode]) => {
                if (mode === 'edit' || mode === 'create') {
                    this.store.initValidators(record);
                } else {
                    this.store.resetValidatorsForAllFields(record);
                }
                record.formGroup.enable();
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
