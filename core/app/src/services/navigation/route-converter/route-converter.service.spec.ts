import {TestBed} from '@angular/core/testing';
import {RouteConverter} from '@services/navigation/route-converter/route-converter.service';
import {routeConverterMock} from '@services/navigation/route-converter/route-converter.service.spec.mock';

describe('Route Converter Service', () => {
    const service: RouteConverter = routeConverterMock;

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('#toFrontEnd', () => {
        const baseUrl = 'index.php';
        const params = '?module=Accounts&return_module=Accounts&action=DetailView&record=9551c669-c8d4-01b8-ec01-5ea2ef347a6b';
        const legacyLink = baseUrl + params;
        const route = service.toFrontEndRoute(legacyLink);

        const expected = 'accounts/record/9551c669-c8d4-01b8-ec01-5ea2ef347a6b?return_module=Accounts';

        expect(route).toEqual(expected);
    });

    it('#toLegacy', () => {
        const params = {
            action: 'index',
            module: 'accounts'
        };

        const queryParams = {
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            return_action: 'DetailView',
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            return_module: 'Accounts'
        };
        const legacyLink = service.toLegacy(params, queryParams);

        const link = './legacy/index.php?return_action=DetailView&return_module=Accounts&module=Accounts&action=index';

        expect(legacyLink).toEqual(link);
    });
});

