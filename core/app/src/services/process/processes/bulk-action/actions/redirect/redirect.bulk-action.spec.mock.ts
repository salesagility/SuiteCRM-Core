import {RedirectBulkAction} from '@services/process/processes/bulk-action/actions/redirect/redirect.bulk-action';
import {messageServiceMock} from '@services/message/message.service.spec.mock';
import {Router} from '@angular/router';
import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';


TestBed.configureTestingModule({
    imports: [
        RouterTestingModule
    ],
}).compileComponents().then();

const router = TestBed.get(Router); // Just if we need to test Route Service functionality


export const redirectBulkActionMock = new RedirectBulkAction(router, messageServiceMock);
