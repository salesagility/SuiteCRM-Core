import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, take, tap} from 'rxjs/operators';
import {Process, ProcessService} from '@services/process/process.service';
import {AppStateStore} from '@store/app-state/app-state.store';
import {MessageService} from '@services/message/message.service';
import {BulkActionHandler} from '@services/process/processes/bulk-action/bulk-action.model';
import {RedirectBulkAction} from '@services/process/processes/bulk-action/actions/redirect/redirect.bulk-action';
import {ExportBulkAction} from '@services/process/processes/bulk-action/actions/export/export.bulk-action';
import {SearchCriteria} from '@app-common/views/list/search-criteria.model';
import {SortingSelection} from '@app-common/views/list/list-navigation.model';

export interface BulkActionProcessInput {
    action: string;
    module: string;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
    ids?: string[];
}

@Injectable({
    providedIn: 'root',
})
export class BulkActionProcess {

    actions: { [key: string]: BulkActionHandler } = {};

    constructor(
        private processService: ProcessService,
        private appStateStore: AppStateStore,
        protected message: MessageService,
        protected redirectActionHandler: RedirectBulkAction,
        protected exportBulkAction: ExportBulkAction
    ) {
        this.actions[redirectActionHandler.key] = redirectActionHandler;
        this.actions[exportBulkAction.key] = exportBulkAction;
    }

    /**
     * Send bulk action request
     *
     * @param {string} action to submit
     * @param {string} data to send
     * @returns {{}} Observable<Process>
     */
    public run(action: string, data: BulkActionProcessInput): Observable<Process> {
        const options = {
            ...data
        };

        this.appStateStore.updateLoading(action, true);

        return this.processService
            .submit(action, options)
            .pipe(
                take(1),
                tap((process: Process) => {
                    this.appStateStore.updateLoading(action, false);

                    let handler = 'addSuccessMessageByKey';
                    if (process.status === 'error') {
                        handler = 'addDangerMessageByKey';
                    }

                    if (process.messages) {
                        process.messages.forEach(message => {
                            this.message[handler](message);
                        });
                    }

                    if (process.status === 'error') {
                        return;
                    }

                    if (process.data && !process.data.handler) {
                        return;
                    }

                    const actionHandler: BulkActionHandler = this.actions[process.data.handler];

                    if (!actionHandler) {
                        this.message.addDangerMessageByKey('LBL_MISSING_HANDLER');
                        return;
                    }

                    actionHandler.run(process.data.params);

                }),
                catchError(err => {
                    this.message.addDangerMessageByKey('LBL_BULK_ACTION_ERROR');
                    this.appStateStore.updateLoading(action, false);
                    throw err;
                }),
            );
    }
}
