import {NavigationStore} from './navigation.store';
import {navigationMock, navigationMockData} from './navigation.store.spec.mock';

describe('Navigation Store', () => {
    const service: NavigationStore = navigationMock;

    beforeEach(() => {
    });

    it('#load', (done: DoneFn) => {
        service.load().subscribe(data => {
            expect(data).toEqual(jasmine.objectContaining(navigationMockData.navbar));
            done();
        });
    });
});

