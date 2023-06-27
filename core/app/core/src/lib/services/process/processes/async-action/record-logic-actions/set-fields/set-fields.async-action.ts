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
import {AsyncActionData, AsyncActionHandler} from '../../async-action.model';
import {
    RecordLogicContext
} from '../../../../../../views/record/record-logic/record-logic.model';


@Injectable({
    providedIn: 'root'
})
export class SetFieldsAsyncAction extends AsyncActionHandler {
    key = 'set-fields';

    constructor() {
        super();
    }

    run(data: AsyncActionData): void {
        const context: RecordLogicContext = data.context ?? {};
        const fieldsValuesToSet = data.fieldValues ?? null;

        if (!fieldsValuesToSet || !context) {
            return;
        }

        Object.keys(fieldsValuesToSet).forEach(fieldName => {
            const fieldValue = fieldsValuesToSet[fieldName] ?? null;
            if (fieldValue === null || !context?.record?.fields[fieldName]) {
                return;
            }

            context.record.fields[fieldName].value = fieldValue;
            context.record.fields[fieldName].formControl.setValue(fieldValue);
        });
    }
}
