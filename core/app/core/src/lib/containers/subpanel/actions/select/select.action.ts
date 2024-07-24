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
import {Record} from '../../../../common/record/record.model';
import {ViewMode} from '../../../../common/views/view.model';
import {SubpanelActionData, SubpanelActionHandler} from '../subpanel.action';
import {
    RecordListModalComponent
} from "../../../record-list-modal/components/record-list-modal/record-list-modal.component";
import {RecordListModalResult} from "../../../record-list-modal/components/record-list-modal/record-list-modal.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {take} from 'rxjs/operators';
import {AsyncActionInput, AsyncActionService} from '../../../../services/process/processes/async-action/async-action';
import {MessageService} from '../../../../services/message/message.service';


@Injectable({
    providedIn: 'root'
})
export class SubpanelSelectAction extends SubpanelActionHandler {
    key = 'select';

    modes: ViewMode[] = ['list'];

    constructor(
        protected modalService: NgbModal,
        protected message: MessageService,
        protected asyncActionService: AsyncActionService
    ) {
        super();
    }


    shouldDisplay(data: SubpanelActionData): boolean {
        return true;
    }

    run(data: SubpanelActionData): void {

        this.showSelectModal(data);
    }

    /**
     * Show record selection modal
     */
    protected showSelectModal(data: SubpanelActionData): void {
        const modal = this.modalService.open(RecordListModalComponent, {size: 'xl', scrollable: true});

        const module = data.module
        modal.componentInstance.module = module;
        modal.componentInstance.parentModule = data?.parentModule ?? '';
        modal.componentInstance.multiSelect = true;
        modal.componentInstance.multiSelectButtonLabel = 'LBL_LINK';

        modal.result.then((result: RecordListModalResult) => {

            if (!result || !result.selection || !result.selection.selected) {
                return;
            }

            const recordIds = this.getSelectedIds(result);

            let linkField: string = data.subpanelMeta.get_subpanel_data;

            const collectionList = data.subpanelMeta?.collection_list ?? null;

            if (collectionList && collectionList?.[module]?.get_subpanel_data) {
                linkField = collectionList[module].get_subpanel_data;
            }
            const input = {
                action: 'record-select',
                module: data.store.parentModule,
                id: data.store.parentId || '',
                payload: {
                    baseModule: data.parentModule,
                    baseRecordId: data.parentId,
                    linkField,
                    relateModule: module,
                    relateRecordIds: recordIds
                },
            } as AsyncActionInput

            this.runAsyncAction(input, data);
        });
    }


    /**
     * Get Selected Record
     *
     * @param {object} data RecordListModalResult
     * @returns {object} Record
     **/
    protected getSelectedIds(data: RecordListModalResult): Record[] {
        const ids = [];
        Object.keys(data.selection.selected).forEach((selected) => {
            if (selected) {
                ids.push(selected);
            }
        });

        return ids;
    }

    protected runAsyncAction(asyncData: AsyncActionInput, data: SubpanelActionData): void {
        const actionName = 'record-select';

        this.message.removeMessages();


        this.asyncActionService.run(actionName, asyncData).pipe(take(1)).subscribe(() => {
            data.store.load(false).pipe(take(1)).subscribe();
            data.store.loadAllStatistics(false).pipe(take(1)).subscribe();
        });
    }

}
