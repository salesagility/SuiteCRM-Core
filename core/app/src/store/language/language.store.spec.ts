import {LanguageStore} from './language.store';
import {languageStoreMock, languageMockData} from './language.store.spec.mock';

describe('Language Store', () => {
    const service: LanguageStore = languageStoreMock;

    beforeEach(() => {
    });

    it('#load', (done: DoneFn) => {
        service.load('en_us', languageStoreMock.getAvailableStringsTypes()).subscribe(data => {
            expect(data).toEqual(jasmine.objectContaining(languageMockData));
            done();
        });
    });
});

