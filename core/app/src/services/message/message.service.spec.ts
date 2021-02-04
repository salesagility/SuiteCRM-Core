import {TestBed} from '@angular/core/testing';

import {MessageService} from './message.service';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';

describe('MessageService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {provide: LanguageStore, useValue: languageStoreMock},
        ],
    }));

    it('should be created', () => {
        const service: MessageService = TestBed.inject(MessageService);

        expect(service).toBeTruthy();
    });
});
