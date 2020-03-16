import {getTestBed, TestBed} from '@angular/core/testing';
import {LanguageFacade} from "@base/facades/language/language.facade";
import {languageFacadeMock, languageMockData} from "@base/facades/language/language.facade.spec.mock";

describe('Language Facade', () => {
    let injector: TestBed;
    const service: LanguageFacade = languageFacadeMock;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        injector = getTestBed();
    });

    it('#load',
        (done: DoneFn) => {
            service.load('en_us', languageFacadeMock.getAvailableStringsTypes()).subscribe(data => {
                expect(data).toEqual(jasmine.objectContaining(languageMockData));
                done();
            });
        });
});

