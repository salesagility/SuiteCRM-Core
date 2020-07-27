import {BulkActionHandler, BulkActionHandlerData} from '@services/process/processes/bulk-action/bulk-action.model';
import {Injectable} from '@angular/core';
import {MessageService} from '@services/message/message.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ExportBulkAction extends BulkActionHandler {
    key = 'export';

    constructor(
        protected message: MessageService,
        protected http: HttpClient
    ) {
        super();
    }

    run(data: BulkActionHandlerData): void {

        if (!data || !data.url || !data.formData) {
            this.message.addDangerMessageByKey('LBL_MISSING_HANDLER_DATA_ROUTE');
            return;
        }

        const options = {
            responseType: 'blob',
            observe: 'response',
        } as { [key: string]: any };

        if (data.queryParams) {
            options.params = data.queryParams;
        }

        this.download(data.url, data.formData);
    }

    /**
     * Download file
     *
     * NOTE: using a hidden form instead of js for better memory management see:
     * https://github.com/eligrey/FileSaver.js/wiki/Saving-a-remote-file#using-a-form-element-other-than-get-methods
     *
     * @param {string} url for download
     * @param {object} formData to submit
     */
    protected download(url: string, formData: { [key: string]: string }): void {

        const form = document.createElement('form');
        form.setAttribute('id', 'export-download');
        form.setAttribute('method', 'post');
        form.setAttribute('action', url);
        form.setAttribute('target', '_self');
        form.setAttribute('style', 'display: none;');


        Object.keys(formData).forEach(key => {
            const hiddenField = document.createElement('input');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', formData[key]);
            form.appendChild(hiddenField);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
}
