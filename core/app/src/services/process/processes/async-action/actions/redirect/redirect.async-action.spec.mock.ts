import {RedirectAsyncAction} from '@services/process/processes/async-action/actions/redirect/redirect.async-action';
import {messageServiceMock} from '@services/message/message.service.spec.mock';
import {Router} from '@angular/router';
import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';


TestBed.configureTestingModule({
    imports: [
        RouterTestingModule
    ],
}).compileComponents().then();

const router = TestBed.inject(Router); // Just if we need to test Route Service functionality


export const redirectBulkActionMock = new RedirectAsyncAction(router, messageServiceMock);
