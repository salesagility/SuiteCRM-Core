import {getTestBed, TestBed} from '@angular/core/testing';
import {SystemConfigFacade} from '@store/system-config/system-config.facade';
import {systemConfigFacadeMock, systemConfigMockData} from '@store/system-config/system-config.facade.spec.mock';

describe('SystemConfig Facade', () => {
    let injector: TestBed;
    const service: SystemConfigFacade = systemConfigFacadeMock;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        injector = getTestBed();
    });

    it('#load',
        (done: DoneFn) => {

            service.load().subscribe(data => {
                expect(data).toEqual(jasmine.objectContaining(systemConfigMockData.systemConfigs));
                done();
            });
        });
});

