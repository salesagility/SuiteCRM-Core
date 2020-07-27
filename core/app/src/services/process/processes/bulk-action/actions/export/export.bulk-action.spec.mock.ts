import {messageServiceMock} from '@services/message/message.service.spec.mock';
import {TestBed} from '@angular/core/testing';
import {ExportBulkAction} from '@services/process/processes/bulk-action/actions/export/export.bulk-action';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';


TestBed.configureTestingModule({
    imports: [
        HttpClientTestingModule
    ],
}).compileComponents().then();

const http = TestBed.get(HttpClient);

export const exportBulkActionMock = new ExportBulkAction(messageServiceMock, http);
