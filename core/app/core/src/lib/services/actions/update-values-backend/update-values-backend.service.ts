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
import {take} from 'rxjs/operators';
import {Action} from '../../../common/actions/action.model';
import {Field, FieldMap} from '../../../common/record/field.model';
import {StringMap} from '../../../common/types/string-map';
import {Record} from '../../../common/record/record.model';
import {ProcessService} from '../../process/process.service';
import {MessageService} from '../../message/message.service';
import {RecordManager} from '../../record/record.manager';
import {ConfirmationModalService} from '../../modals/confirmation-modal.service';
import {EventBus} from '../../event-bus/event-bus.service';

export interface UpdateValuesBackendCallbacks {
    onStart?: () => void;
    onResult?: (result: any) => void;
    onError?: () => void;
}

@Injectable({
    providedIn: 'root'
})
export class UpdateValuesBackendService {

    constructor(
        protected processService: ProcessService,
        protected messages: MessageService,
        protected recordManager: RecordManager,
        protected confirmation: ConfirmationModalService,
        protected eventBus: EventBus
    ) {
    }

    run(record: Record, action: Action, callbacks: UpdateValuesBackendCallbacks = {}): void {
        const displayConfirmation = action.params?.displayConfirmation || false;
        const selectModal = action.params?.selectModal ?? null;
        const fieldModal = action.params?.fieldModal ?? null;

        if (displayConfirmation) {
            const confirmationLabel = action.params?.confirmationLabel || '';
            const confirmationMessages = action.params?.confirmationMessages || [];
            const confirmationTitle = action.params?.confirmationTitle || '';
            const confirmation = [confirmationLabel, ...confirmationMessages];

            this.confirmation.showModal(confirmation, () => {
                if (selectModal) {
                    this.showSelectModal(selectModal, action, record, callbacks);
                    return;
                }
                if (fieldModal) {
                    this.showFieldModal(fieldModal, action, record, callbacks);
                    return;
                }
                this.callBackend(record, action, callbacks);
            }, () => {
            }, {} as FieldMap, {} as StringMap, confirmationTitle);
            return;
        }

        if (selectModal) {
            this.showSelectModal(selectModal, action, record, callbacks);
            return;
        }

        if (fieldModal) {
            this.showFieldModal(fieldModal, action, record, callbacks);
            return;
        }

        this.callBackend(record, action, callbacks);
    }

    updateFieldValue(field: Field, value: any, allowEmpty: boolean = false): void {

        const valueTypesSet = {
            value: false,
            valueList: false,
            valueObject: false,
            valueObjectArray: false,
        }

        if (value?.value != null) {
            field.value = value.value;
            field.formControl?.setValue(value.value);
            valueTypesSet.value = true;
        }

        if (value?.valueList != null) {
            field.valueList = value.valueList;
            valueTypesSet.valueList = true;
        }

        if (value?.valueObject != null) {
            field.valueObject = value.valueObject;
            valueTypesSet.valueObject = true;
        }

        if (value?.valueObjectArray != null) {
            field.valueObjectArray = value.valueObjectArray;
            valueTypesSet.valueObjectArray = true;
        }

        const anyValueSet = valueTypesSet.value || valueTypesSet.valueList || valueTypesSet.valueObject || valueTypesSet.valueObjectArray;

        if (!allowEmpty || anyValueSet) {
            return;
        }

        field.value = '';
        field.formControl?.setValue('');
        if (field.valueList) {
            field.valueList = [];
        }

        if (field.valueObject) {
            field.valueObject = {};
        }

        if (field.valueObject) {
            field.valueObjectArray = [];
        }
    }

    updateFields(record: Record, fieldValues: { [key: string]: any }, allowEmpty: boolean = false): void {
        Object.keys(fieldValues).forEach(fieldName => {
            const field = record.fields?.[fieldName];
            const value = fieldValues[fieldName];
            if (!field || (!value && !allowEmpty)) {
                return;
            }

            this.updateFieldValue(field, value, allowEmpty);
        });

        record.formGroup?.updateValueAndValidity({onlySelf: true, emitEvent: true});
    }

    protected showSelectModal(selectModal: any, action: Action, record: Record, callbacks: UpdateValuesBackendCallbacks): void {
        this.eventBus.request('open-select-modal', {module: selectModal.module, options: selectModal})
            .subscribe((modalRecord: Record) => {
                if (modalRecord) {
                    const {fields, formGroup, ...baseModalRecord} = modalRecord;
                    action.params.modalRecord = baseModalRecord;
                }
                this.callBackend(record, action, callbacks);
            });
    }

    protected showFieldModal(fieldModal: any, action: Action, record: Record, callbacks: UpdateValuesBackendCallbacks): void {
        this.eventBus.request('open-field-modal', {options: {...fieldModal}})
            .subscribe((fields: Field[]) => {
                if (fields) {
                    action.params.modalFields = fields;
                }
                this.callBackend(record, action, callbacks);
            });
    }

    protected callBackend(record: Record, action: Action, callbacks: UpdateValuesBackendCallbacks): void {
        const processType = action.params.process;
        const baseRecord = this.recordManager.getBaseRecord(record);

        const options: any = {
            action: processType,
            module: record.module ?? '',
            record: baseRecord
        };

        if (action.params?.modalRecord) {
            options.modalRecord = action.params.modalRecord;
        }

        if (action.params?.modalFields) {
            options.modalFields = action.params.modalFields;
        }

        if (action.params?.relateModule) {
            options.relateModule = action.params.relateModule;
        }

        if (action.params?.relateId) {
            options.relateId = action.params.relateId;
        }

        if (action.params?.updateFields) {
            options.updateFields = action.params.updateFields;
        }

        callbacks.onStart?.();

        this.processService.submit(processType, options).pipe(take(1)).subscribe({
            next: (result) => {
                this.handleMessages(result);
                callbacks.onResult?.(result);
            },
            error: () => {
                callbacks.onError?.();
            }
        });
    }

    protected handleMessages(result: any): void {
        let handler = 'addSuccessMessageByKey';
        if (result?.status === 'error') {
            handler = 'addDangerMessageByKey';
        }

        if (result?.messages && result?.messages?.length) {
            result.messages.forEach(message => {
                if (!!message) {
                    this.messages[handler](message);
                }
            });
        }
    }
}
