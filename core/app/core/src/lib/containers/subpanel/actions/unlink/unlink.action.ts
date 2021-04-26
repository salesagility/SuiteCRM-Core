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
import {SubpanelActionData, SubpanelActionHandler} from '../subpanel.action';
import {MessageModalComponent} from "../../../../components/modal/components/message-modal/message-modal.component";
import {Action, ModalButtonInterface} from "common";
import {SubpanelActionsAdapter} from "../../adapters/subpanel-actions.adapter";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
    providedIn: 'root'
})
export class SubpanelUnlinkAction extends SubpanelActionHandler {
    key = 'unlink';

    constructor(
        protected subpanelAdaptor: SubpanelActionsAdapter,
        private modalService: NgbModal
    ) {
        super();
    }

    run(data: SubpanelActionData): void {

        this.showConfirmationModal(data);
    }

    protected showConfirmationModal(data: SubpanelActionData): void {

        const modal = this.modalService.open(MessageModalComponent);

        modal.componentInstance.textKey = 'LBL_UNLINK_RELATIONSHIP_CONFIRM';
        modal.componentInstance.buttons = [
            {
                labelKey: 'LBL_CANCEL',
                klass: ['btn-secondary'],
                onClick: activeModal => activeModal.dismiss()
            } as ModalButtonInterface,
            {
                labelKey: 'LBL_PROCEED',
                klass: ['btn-main'],
                onClick: activeModal => {

                    const action: Action =
                        {
                            key: this.key,
                            asyncProcess: true,
                            params: {
                                store: data.store,
                                payload: {
                                    baseModule: data.parentModule,
                                    baseRecordId: data.parentId,
                                    relateModule: data.store.metadata.get_subpanel_data?? data.module,
                                    relateRecordId: data.id
                                }
                            }
                        }
                    this.subpanelAdaptor.runAction(action);

                    activeModal.close();
                }
            } as ModalButtonInterface,
        ];
    }
}
