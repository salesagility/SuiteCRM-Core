import {LanguageFacade} from './language.facade';
import {languageFacadeMock, languageMockData} from './language.facade.spec.mock';

describe('Language Facade', () => {
    const service: LanguageFacade = languageFacadeMock;

    beforeEach(() => {
    });

    it('#load', (done: DoneFn) => {
        service.load('en_us', languageFacadeMock.getAvailableStringsTypes()).subscribe(data => {
            expect(data).toEqual(jasmine.objectContaining(languageMockData));
            done();
        });
    });
});

