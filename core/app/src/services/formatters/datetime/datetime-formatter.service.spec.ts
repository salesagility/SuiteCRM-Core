import {TestBed} from '@angular/core/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {DatetimeFormatter} from './datetime-formatter.service';

describe('DatetimeFormatterService', () => {
    let service: DatetimeFormatter;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(DatetimeFormatter);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
