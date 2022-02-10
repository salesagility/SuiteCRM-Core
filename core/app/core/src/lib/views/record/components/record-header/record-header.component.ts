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
import {Subscription} from 'rxjs';
import {RecordViewStore} from '../../store/record-view/record-view.store';
import {ModuleNavigation} from '../../../../services/navigation/module-navigation/module-navigation.service';
import {RecordActionsAdapter} from '../../adapters/actions.adapter';
import {ActionContext, Record} from 'common';

@Component({
    selector: 'scrm-record-header',
    templateUrl: 'record-header.component.html',
    providers: [RecordActionsAdapter]
})
export class RecordHeaderComponent implements OnInit, OnDestroy {

    record: Record;
    displayResponsiveTable = false;

    protected subs: Subscription[] = [];

    constructor(
        public actionsAdapter: RecordActionsAdapter,
        protected recordViewStore: RecordViewStore,
        protected moduleNavigation: ModuleNavigation
    ) {
    }

    ngOnInit(): void {
        this.subs.push(this.recordViewStore.record$.subscribe(record => {
            this.record = record;
        }));
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    get moduleTitle(): string {
        const module = this.recordViewStore.vm.appData.module;
        const appListStrings = this.recordViewStore.vm.appData.language.appListStrings;
        return this.moduleNavigation.getModuleLabel(module, appListStrings);
    }

    /**
     * Get Summary template
     *
     * @returns {string} template label
     */
    getSummaryTemplate(): string {
        return this.recordViewStore.getSummaryTemplate();
    }

    /**
     * Build action context
     * @param record
     */
    getActionContext(record: Record): ActionContext {
        if (!record) {
            return {} as ActionContext
        }

        return {
            module: record.module || '',
            record
        } as ActionContext
    }
}
