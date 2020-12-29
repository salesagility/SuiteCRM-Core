import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {TextDetailFieldComponent} from './text.component';
import {Field} from '@app-common/record/field.model';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {dateFormatterMock} from '@services/formatters/datetime/date-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';

@Component({
    selector: 'text-detail-field-test-host-component',
    template: '<scrm-text-detail [field]="field"></scrm-text-detail>'
})
class TextDetailFieldTestHostComponent {
    field: Field = {
        type: 'text',
        value: 'My Text',
        metadata: null
    };
}

describe('TextDetailFieldComponent', () => {
    let testHostComponent: TextDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<TextDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TextDetailFieldTestHostComponent,
                TextDetailFieldComponent,
            ],
            imports: [],
            providers: [
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
                {provide: NumberFormatter, useValue: numberFormatterMock},
                {provide: DatetimeFormatter, useValue: datetimeFormatterMock},
                {provide: DateFormatter, useValue: dateFormatterMock},
                {
                    provide: CurrencyFormatter,
                    useValue: new CurrencyFormatter(userPreferenceStoreMock, numberFormatterMock, 'en_us')
                },
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(TextDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain('My Text');
    });

    it('should have default rows 6', () => {
        const el = testHostFixture.nativeElement.querySelector('textarea');

        expect(testHostComponent).toBeTruthy();
        expect(el).toBeTruthy();
        expect(el.rows).toEqual(6);
    });

    it('should have default cols 20', () => {
        const el = testHostFixture.nativeElement.querySelector('textarea');

        expect(testHostComponent).toBeTruthy();
        expect(el).toBeTruthy();
        expect(el.cols).toEqual(20);
    });
});
