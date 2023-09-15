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

import {BehaviorSubject, combineLatestWith, Observable, Subscription} from 'rxjs';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Action, Panel, PanelRow, Record, ViewMode} from 'common';
import {MetadataStore, RecordViewMetadata} from '../../../store/metadata/metadata.store.service';
import {RecordContentConfig, RecordContentDataSource} from '../../../components/record-content/record-content.model';
import {RecordActionManager} from '../actions/record-action-manager.service';
import {RecordActionData} from '../actions/record.action';
import {LanguageStore} from '../../../store/language/language.store';
import {RecordViewStore} from '../store/record-view/record-view.store';
import {FieldActionsAdapterFactory} from '../../../components/field-layout/adapters/field.actions.adapter.factory';
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
        protected actionAdaptorFactory: FieldActionsAdapterFactory,
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
        return this.metadata.recordViewMetadata$.pipe(
            combineLatestWith(this.store.stagingRecord$, this.language.vm$),
            map(([meta, record, languages]) => {
                const panels = [];
                const module = (record && record.module) || '';

                this.fieldSubs.forEach(sub => sub.unsubscribe());

                meta.panels.forEach(panelDefinition => {
                    const label = this.language.getFieldLabel(panelDefinition.key.toUpperCase(), module, languages);
                    const panel = {label, key: panelDefinition.key, rows: []} as Panel;
                    let adaptor = null;


                    const tabDef = meta.templateMeta.tabDefs[panelDefinition.key.toUpperCase()] ?? null;
                    if(tabDef) {
                        panel.meta = tabDef;
                    }

                    panelDefinition.rows.forEach(rowDefinition => {
                        const row = {cols: []} as PanelRow;

                        rowDefinition.cols.forEach(cellDefinition => {
                            const cellDef = {...cellDefinition};
                            const fieldActions = cellDefinition.fieldActions || null;
                            if(fieldActions) {
                                adaptor = this.actionAdaptorFactory.create('recordView', cellDef.name, this.store);
                                cellDef.adaptor = adaptor;
                            }
                            row.cols.push(cellDef);
                        });
                        panel.rows.push(row);
                    });

                    panel.displayState = new BehaviorSubject(tabDef?.display ?? true);
                    panel.display$ = panel.displayState.asObservable();

                    panels.push(panel);

                    if (tabDef?.displayLogic) {
                        Object.keys(tabDef.displayLogic).forEach((logicDefKey) => {
                            const logicDef = tabDef.displayLogic[logicDefKey];
                            const logicType = logicDef.key;

                            if(logicDef.params.fieldDependencies && (record && record.fields)) {
                                logicDef.params.fieldDependencies.forEach(fieldKey => {
                                    const field = record.fields[fieldKey] || null;
                                    if (!field) {
                                        return;
                                    }

                                    this.fieldSubs.push(field.valueChanges$.subscribe((value) => {
                                        this.logicManager.runLogic(logicType, field, panel, record, this.store.getMode());

                                    }));
                                });
                            }
                        });
                    }
                });
                return panels;
            })
        );
    }

    getRecord(): Observable<Record> {
        return this.store.stagingRecord$.pipe(
            combineLatestWith(this.store.mode$),
            map(([record, mode]: [Record, ViewMode]) => {
                if (mode === 'edit' || mode === 'create') {
                    this.store.initValidators(record);
                } else {
                    this.store.resetValidatorsForAllFields(record);
                }

                if(record.formGroup) {
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
