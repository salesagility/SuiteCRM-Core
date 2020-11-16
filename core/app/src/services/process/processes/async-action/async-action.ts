import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, take, tap} from 'rxjs/operators';
import {Process, ProcessService} from '@services/process/process.service';
import {AppStateStore} from '@store/app-state/app-state.store';
import {MessageService} from '@services/message/message.service';
import {AsyncActionHandler} from '@services/process/processes/async-action/async-action.model';
import {SearchCriteria} from '@app-common/views/list/search-criteria.model';
import {SortingSelection} from '@app-common/views/list/list-navigation.model';
import {RedirectAsyncAction} from '@services/process/processes/async-action/actions/redirect/redirect.async-action';
import {ExportAsyncAction} from '@services/process/processes/async-action/actions/export/export.async-action';

export interface AsyncActionInput {
    action: string;
    module: string;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
    ids?: string[];
}

@Injectable({
    providedIn: 'root',
})
export class AsyncActionService {

    actions: { [key: string]: AsyncActionHandler } = {};

    constructor(
        private processService: ProcessService,
        private appStateStore: AppStateStore,
        protected message: MessageService,
        protected redirectAction: RedirectAsyncAction,
        protected exportAction: ExportAsyncAction
    ) {
        this.registerHandler(redirectAction);
        this.registerHandler(exportAction);
    }

    public registerHandler(handler: AsyncActionHandler): void {
        this.actions[handler.key] = handler;
    }

    /**
     * Send action request
     *
     * @param {string} action to submit
     * @param {string} data to send
     * @returns {object} Observable<Process>
     */
    public run(action: string, data: AsyncActionInput): Observable<Process> {
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

                    const actionHandler: AsyncActionHandler = this.actions[process.data.handler];

                    if (!actionHandler) {
                        this.message.addDangerMessageByKey('LBL_MISSING_HANDLER');
                        return;
                    }

                    actionHandler.run(process.data.params);

                }),
                catchError(err => {
                    this.message.addDangerMessageByKey('LBL_ACTION_ERROR');
                    this.appStateStore.updateLoading(action, false);
                    throw err;
                }),
            );
    }
}
