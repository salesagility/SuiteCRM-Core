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

import {Injectable} from '@angular/core';
import {Action} from '../../../../common/actions/action.model';
import {StringArrayMap} from '../../../../common/types/string-map';
import {ViewMode} from '../../../../common/views/view.model';
import {RecordLogicActionData, RecordLogicActionHandler} from '../record-logic.action';
import {ActiveFieldsChecker} from '../../../../services/condition-operators/active-fields-checker.service';
import {MessageService} from '../../../../services/message/message.service';
import {UpdateValuesBackendService} from '../../../../services/actions/update-values-backend/update-values-backend.service';
import {ObjectArrayMatrix} from '../../../../common/types/object-map';

@Injectable({
    providedIn: 'root'
})
export class AutofillFromRelateAction extends RecordLogicActionHandler {

    key = 'autofillFromRelate';
    modes = ['edit', 'create'] as ViewMode[];

    protected static readonly PROCESS_TYPE = 'autofill-from-relate';

    constructor(
        protected activeFieldsChecker: ActiveFieldsChecker,
        protected messages: MessageService,
        protected updateValuesBackendService: UpdateValuesBackendService
    ) {
        super();
    }

    run(data: RecordLogicActionData, action: Action): void {
        const record = data.record;

        if (!record) {
            return;
        }

        const activeOnFields: StringArrayMap = action.params?.activeOnFields || {} as StringArrayMap;
        const relatedFields: string[] = Object.keys(activeOnFields);

        const activeOnAttributes: ObjectArrayMatrix = action.params?.activeOnAttributes || {} as ObjectArrayMatrix;
        const relatedAttributesFields: string[] = Object.keys(activeOnAttributes);

        const updateFields = action.params?.updateFields;
        const relateField = action.params?.relateField;

        if (!updateFields || !relateField) {
            return;
        }

        if (relatedFields.length || relatedAttributesFields.length) {
            const isActive = this.activeFieldsChecker.isActive(relatedFields, record, activeOnFields, relatedAttributesFields, activeOnAttributes);
            if (!isActive) {
                return;
            }
        }

        const field = record.fields?.[relateField];
        const idName = field?.definition?.id_name || '';
        let relateId = field?.valueObject?.id || record.attributes?.[relateField]?.id || '';
        if (!relateId && idName !== 'id') {
            relateId = field?.valueObject?.[idName] || record.attributes?.[relateField]?.[idName] || '';
        }

        const relateModule = field?.definition?.module || '';

        const enrichedAction: Action = {
            ...action,
            params: {
                ...action.params,
                process: AutofillFromRelateAction.PROCESS_TYPE,
                relateModule,
                relateId,
            }
        };

        this.updateValuesBackendService.run(record, enrichedAction, {
            onResult: (result) => {
                const fieldValues = result?.data?.fieldValues ?? null;
                if (!fieldValues) {
                    return;
                }
                this.updateValuesBackendService.updateFields(record, fieldValues);
            },
            onError: () => {
                this.messages.addDangerMessageByKey('ERR_RECORD_LOGIC_BACKEND_CALCULATION');
            }
        });
    }

    getTriggeringStatus(): string[] {
        return ['onDependencyChange'];
    }
}
