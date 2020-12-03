import {LanguageStore} from './language.store';
import {languageStoreMock, languageMockData} from './language.store.spec.mock';
import {RouterTestingModule} from '@angular/router/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('Language Store', () => {
    const service: LanguageStore = languageStoreMock;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            providers: [],
            declarations: []
        })
            .compileComponents();
    }));

    it('#load', (done: DoneFn) => {
        service.load('en_us', languageStoreMock.getAvailableStringsTypes()).subscribe(data => {
            expect(data).toEqual(jasmine.objectContaining(languageMockData));
            done();
        });
    });
});

