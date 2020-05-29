import {getTestBed, TestBed} from '@angular/core/testing';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {systemConfigStoreMock, systemConfigMockData} from '@store/system-config/system-config.store.spec.mock';

describe('SystemConfig Store', () => {
    let injector: TestBed;
    const service: SystemConfigStore = systemConfigStoreMock;

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

