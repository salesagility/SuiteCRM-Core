import {BulkActionHandler, BulkActionHandlerData} from '@services/process/processes/bulk-action/bulk-action.model';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from '@services/message/message.service';

@Injectable({
    providedIn: 'root'
})
export class RedirectBulkAction extends BulkActionHandler {
    key = 'redirect';

    constructor(
        protected router: Router,
        protected message: MessageService,
    ) {
        super();
    }

    run(data: BulkActionHandlerData): void {

        if (!data || !data.route) {
            this.message.addDangerMessageByKey('LBL_MISSING_HANDLER_DATA_ROUTE');
            return;
        }

        const params = {
            queryParams: {}
        };

        if (data.queryParams) {
            params.queryParams = data.queryParams;
        }

        this.router.navigate([data.route], params).then();
    }
}
