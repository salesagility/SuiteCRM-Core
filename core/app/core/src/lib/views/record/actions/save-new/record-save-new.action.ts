import {Injectable} from '@angular/core';
import {ViewMode} from 'common';
import {take} from 'rxjs/operators';
import {ModuleNameMapper} from '../../../../services/navigation/module-name-mapper/module-name-mapper.service';
import {RecordActionData, RecordActionHandler} from '../record.action';
import {ActionNameMapper} from '../../../../services/navigation/action-name-mapper/action-name-mapper.service';
import {Router} from '@angular/router';
import {MessageService} from '../../../../services/message/message.service';

@Injectable({
    providedIn: 'root'
})
export class RecordSaveNewAction extends RecordActionHandler {

    key = 'saveNew';
    modes = ['create' as ViewMode];

    constructor(
        protected message: MessageService,
        protected router: Router,
        protected moduleNameMapper: ModuleNameMapper,
        protected actionNameMapper: ActionNameMapper
    ) {
        super();
    }

    run(data: RecordActionData): void {
        data.store.recordStore.validate().pipe(take(1)).subscribe(valid => {
            if (valid) {
                data.store.save().pipe(take(1)).subscribe(
                    record => {
                        const store = data.store;

                        let returnModule = '';

                        if (store.params.return_module) {
                            returnModule = this.moduleNameMapper.toFrontend(store.params.return_module);
                        }

                        let returnAction = '';

                        if (store.params.return_action) {
                            returnAction = this.actionNameMapper.toFrontend(store.params.return_action);
                        }

                        const returnId = store.params.return_id || '';

                        let route = '';
                        if (returnModule) {
                            route += '/' + returnModule;
                        }

                        if (returnAction) {
                            route += '/' + returnAction;
                        }

                        if (returnId) {
                            route += '/' + returnId;
                        }

                        if (returnModule === store.getModuleName() && returnAction === 'record') {
                            route = '/' + store.getModuleName() + '/record/' + record.id;
                        }

                        if (!route && record && record.id) {
                            route = '/' + store.getModuleName() + '/record/' + record.id;
                        }

                        if (!route && record && record.id) {
                            route = '/' + store.getModuleName();
                        }

                        this.router.navigate([route]).then();
                    }
                );
                return;
            }

            this.message.addWarningMessageByKey('LBL_VALIDATION_ERRORS');
        });
    }

    shouldDisplay(): boolean {
        return true;
    }
}
