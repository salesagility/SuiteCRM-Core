import {NavigationFacade} from './navigation.facade';
import {navigationMock, navigationMockData} from './navigation.facade.spec.mock';

describe('Navigation Facade', () => {
    const service: NavigationFacade = navigationMock;

    beforeEach(() => {
    });

    it('#load', (done: DoneFn) => {
        service.load().subscribe(data => {
            expect(data).toEqual(jasmine.objectContaining(navigationMockData.navbar));
            done();
        });
    });
});

