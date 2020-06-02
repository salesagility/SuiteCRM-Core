import {GlobalSearch} from '@services/navigation/global-search/global-search.service';

describe('Global Search Service', () => {
    let routerMock = null;
    let service = null;
    let lastRoute = '';
    let lastQueryString = '';

    beforeEach(() => {
        routerMock = jasmine.createSpyObj('Router', ['navigate']);

        routerMock.navigate.and.callFake((route, extras) => {
            lastRoute = (route && route[0]) || '';
            lastQueryString = (extras && extras.queryParams && extras.queryParams.query_string) || '';
            return {
                finally: (): void => {
                }
            };
        });

        service = new GlobalSearch(routerMock);
    });

    it('#navigateToSearch', () => {
        lastRoute = '';
        lastQueryString = '';
        const term = 'test search term';
        service.navigateToSearch(term);

        expect(lastRoute).toEqual('/home/unified-search');
        expect(lastQueryString).toEqual(term);
    });
});

