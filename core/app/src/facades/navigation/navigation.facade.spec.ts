import {getTestBed, TestBed} from '@angular/core/testing';
import {NavigationFacade} from './navigation.facade';
import {navigationMock, navigationMockData} from './navigation.facade.spec.mock';

describe('Navigation Facade', () => {
    let injector: TestBed;
    const service: NavigationFacade = navigationMock;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        injector = getTestBed();
    });

    it('#load',
        (done: DoneFn) => {

            service.load().subscribe(data => {
                expect(data).toEqual(jasmine.objectContaining(navigationMockData.navbar));
                done();
            });
        });
});

