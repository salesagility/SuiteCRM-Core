/**
 * SuiteCRM is a customer relationship management program developed by SuiteCRM Ltd.
 * Copyright (C) 2026 SuiteCRM Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUITECRM, SUITECRM DISCLAIMS THE
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

import {Injectable, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {debounceTime, skip} from 'rxjs/operators';
import {Record} from '../../../common/record/record.model';
import {ViewMode} from '../../../common/views/view.model';
import {RecordLogicMap} from './record-logic.action';
import {RecordLogicManager} from './record-logic.manager';

@Injectable()
export class RecordLogicDependencyService implements OnDestroy {

    protected subs: Subscription[] = [];
    protected onInitRecordLogicExecuted: boolean = false;

    constructor(
        protected recordLogicManager: RecordLogicManager
    ) {
    }

    init(record: Record, config: RecordLogicMap, mode: ViewMode): void {
        this.clear();

        if (!config || !Object.keys(config).length) {
            return;
        }

        if (!record?.fields) {
            return;
        }

        if (!this.onInitRecordLogicExecuted) {
            this.onInitRecordLogicExecuted = true;
            this.recordLogicManager.runLogic(record, mode, config, 'onRecordInit');
        }

        const depFieldNames = this.collectDependencyFields(config);

        depFieldNames.forEach(fieldName => {
            const field = record.fields[fieldName];
            if (!field?.valueChanges$) {
                return;
            }

            this.subs.push(
                field.valueChanges$.pipe(skip(1), debounceTime(500)).subscribe(() => {
                    this.recordLogicManager.runLogic(record, mode, config, 'onDependencyChange', fieldName);
                })
            );
        });
    }

    clear(): void {
        this.subs.forEach(sub => sub.unsubscribe());
        this.subs = [];
    }

    ngOnDestroy(): void {
        this.clear();
    }

    protected collectDependencyFields(config: RecordLogicMap): string[] {
        const fieldNames = new Set<string>();

        Object.values(config).forEach(rule => {
            const deps: string[] = rule?.params?.fieldDependencies ?? [];
            deps.forEach(dep => fieldNames.add(dep));

            if (!deps.length) {
                const activeOnFields = rule?.params?.activeOnFields ?? {};
                Object.keys(activeOnFields).forEach(field => fieldNames.add(field));
            }
        });

        return Array.from(fieldNames);
    }
}
