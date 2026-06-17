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
import {Observable, of} from 'rxjs';
import {take} from 'rxjs/operators';
import {Action, ActionHandler} from '../../../common/actions/action.model';
import {ViewMode} from '../../../common/views/view.model';
import {AnyModalButtonInterface, ModalButtonGroupInterface, ModalCloseFeedBack} from '../../../common/components/modal/modal.model';
import {AsyncActionInput, AsyncActionService} from '../../../services/process/processes/async-action/async-action';
import {Process} from '../../../services/process/process.service';
import {
    ConfirmationListAction,
    ConfirmationListActionData,
    ConfirmationListActionsAdapterConfig
} from '../models/confirmation-list-modal.model';
import {ConfirmationListActionManager} from './confirmation-list-action-manager.service';

@Injectable()
export class ConfirmationListActionsAdapter {

    protected config: ConfirmationListActionsAdapterConfig;
    protected mode: ViewMode = 'list';

    constructor(
        protected actionManager: ConfirmationListActionManager,
        protected asyncActionService: AsyncActionService
    ) {
    }

    init(config: ConfirmationListActionsAdapterConfig): void {
        this.config = config;
    }

    buildButtonGroup(): Observable<ModalButtonGroupInterface> {
        const buttons: AnyModalButtonInterface[] = [];

        for (const actionConfig of this.config.actions) {
            const action = this.toAction(actionConfig);
            const handler = this.actionManager.getHandler(action, this.mode);

            if (!handler) {
                continue;
            }

            buttons.push(this.buildButton(action, actionConfig, handler));
        }

        return of({buttons} as ModalButtonGroupInterface);
    }

    protected buildButton(
        action: Action,
        actionConfig: ConfirmationListAction,
        handler: ActionHandler<ConfirmationListActionData>
    ): AnyModalButtonInterface {
        return {
            labelKey: actionConfig.labelKey,
            klass: actionConfig.klass ?? ['btn-secondary'],
            onClick: (): void => {
                if (action.asyncProcess) {
                    this.runAsyncAction(action, actionConfig);
                    return;
                }

                this.runAction(action, handler);
            }
        } as AnyModalButtonInterface;
    }

    protected runAction(action: Action, handler: ActionHandler<ConfirmationListActionData>): void {
        const data = this.buildActionData(action);
        handler.run(data, action);
    }

    protected runAsyncAction(action: Action, actionConfig: ConfirmationListAction): void {
        const ids = this.config.store.recordList.records.map(r => r.id);
        const input: AsyncActionInput = {
            action: action.key,
            module: this.config.module,
            ids,
            payload: actionConfig.params ?? {}
        };

        this.asyncActionService.run(action.key, input).pipe(take(1)).subscribe({
            next: (process: Process) => {
                if (!process) {
                    return;
                }

                this.handleAsyncResponse(process);
            }
        });
    }

    protected handleAsyncResponse(process: Process): void {
        const data = process?.data ?? {};

        if (data.reload) {
            this.config.store.load(false);
        }

        if (data.callOnProceed) {
            this.config.onProceed();
        }

        if (data.closeModal) {
            this.config.activeModal.close({
                type: 'close-button'
            } as ModalCloseFeedBack);
            return;
        }

        if (data.dismissModal) {
            this.config.activeModal.dismiss();
        }
    }

    protected buildActionData(action: Action): ConfirmationListActionData {
        return {
            module: this.config.module,
            store: this.config.store,
            activeModal: this.config.activeModal,
            onProceed: this.config.onProceed,
            onClose: this.config.onClose,
            action
        };
    }

    protected toAction(actionConfig: ConfirmationListAction): Action {
        return {
            key: actionConfig.key,
            labelKey: actionConfig.labelKey,
            asyncProcess: actionConfig.asyncProcess ?? false,
            klass: actionConfig.klass,
            params: actionConfig.params
        } as Action;
    }
}
