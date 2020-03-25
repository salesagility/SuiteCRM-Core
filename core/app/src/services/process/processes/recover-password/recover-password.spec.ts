import {getTestBed, TestBed} from '@angular/core/testing';
import {
    recoverPasswordMock,
    recoverPasswordMockData
} from '@services/process/processes/recover-password/recover-passoword.spec.mock';
import {RecoverPasswordService} from '@services/process/processes/recover-password/recover-password';

describe('Reset Password service', () => {
    let injector: TestBed;
    const service: RecoverPasswordService = recoverPasswordMock;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        injector = getTestBed();
    });

    it('#run',
        (done: DoneFn) => {
            service.run('john.doe', 'jonh.doe@example.com').subscribe(data => {
                expect(data).toEqual(jasmine.objectContaining(recoverPasswordMockData.data.createProcess.process));
                done();
            });
        });
});

