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
import {Action, ActionContext} from '../../../common/actions/action.model';
import {Record} from '../../../common/record/record.model';
import {ViewMode} from '../../../common/views/view.model';
import {combineLatestWith, Observable, of} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {AsyncActionInput, AsyncActionService} from '../../../services/process/processes/async-action/async-action';
import {MessageService} from '../../../services/message/message.service';
import {Process} from '../../../services/process/process.service';
import {ListViewStore} from '../store/list-view/list-view.store';
import {ConfirmationModalService} from '../../../services/modals/confirmation-modal.service';
import {LanguageStore} from '../../../store/language/language.store';
import {SelectModalService} from '../../../services/modals/select-modal.service';
import {MetadataStore} from '../../../store/metadata/metadata.store.service';
import {BaseActionsAdapter} from "../../../services/actions/base-action.adapter";
import {TableActionData} from "../table-actions/table.action";
import {TableActionManager} from "../table-actions/table-action-manager.service";
import {AppMetadataStore} from "../../../store/app-metadata/app-metadata.store.service";


@Injectable()
export class ListViewTableActionsAdapter extends BaseActionsAdapter<TableActionData> {

    constructor(
        protected store: ListViewStore,
        protected actionManager: TableActionManager,
        protected asyncActionService: AsyncActionService,
        protected message: MessageService,
        protected confirmation: ConfirmationModalService,
        protected language: LanguageStore,
        protected selectModalService: SelectModalService,
        protected metadata: MetadataStore,
        protected appMetadataStore: AppMetadataStore
    ) {
        super(
            actionManager,
            asyncActionService,
            message,
            confirmation,
            language,
            selectModalService,
            metadata,
            appMetadataStore
        );
    }

    protected buildActionData(action: Action, context?: ActionContext): TableActionData {
        return {
            store: this.store,
            action: action
        } as TableActionData;
    }

    /**
     * Get action name
     * @param action
     */
    protected getActionName(action: Action) {
        return `table-action-${action.key}`;
    }

    /**
     * Build backend process input
     *
     * @param action
     * @param actionName
     * @param moduleName
     * @param context
     */
    protected buildActionInput(action: Action, actionName: string, moduleName: string, context: ActionContext = null): AsyncActionInput {
        const selection = this.store.recordList.selection;

        const displayedFields = [];

        this.store.metadata.listView.fields.forEach(value => {
            displayedFields.push(value.name);
        });

        const data = {
            action: actionName,
            module: moduleName,
            criteria: null,
            sort: null,
            ids: null,
            fields: displayedFields,
            params: (action && action.params) || [],
        } as AsyncActionInput;

        if (selection.all && selection.count > this.store.recordList.records.length) {
            data.criteria = this.store.recordList.criteria;
            data.sort = this.store.recordList.sort;
        }

        if (selection.all && selection.count <= this.store.recordList.records.length) {
            data.ids = [];
            this.store.recordList.records.forEach(record => {
                data.ids.push(record.id);
            });
        }

        if (!selection.all) {
            data.ids = Object.keys(selection.selected);
        }

        return data;
    }

    getActions(context: ActionContext = null): Observable<Action[]> {
        return this.store.tableActions$.pipe(
            combineLatestWith(
                of('list' as ViewMode).pipe(shareReplay())
            ),
            map(([tableActions, mode]: [Action[], ViewMode]) => {
                return  this.parseModeActions(tableActions, mode, context);
            })
        );
    }

    protected getModuleName(context?: ActionContext): string {
        return this.store.getModuleName();
    }

    protected reload(action: Action, process: Process, record?: Record): void {
        this.store.recordList.clearSelection();
        this.store.recordList.resetPagination();
    }

    protected getMode(): ViewMode {
        return 'list' as ViewMode;
    }
}
