import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {PhoneDetailFieldComponent} from './phone.component';
import {Field} from '@app-common/record/field.model';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {dateFormatterMock} from '@services/formatters/datetime/date-formatter.service.spec.mock';

@Component({
    selector: 'phone-detail-field-test-host-component',
    template: '<scrm-phone-detail [field]="field"></scrm-phone-detail>'
})
class PhoneDetailFieldTestHostComponent {
    field: Field = {
        type: 'phone',
        value: '+44 1111 123456'
    };
}

describe('PhoneDetailFieldComponent', () => {
    let testHostComponent: PhoneDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<PhoneDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PhoneDetailFieldComponent,
                PhoneDetailFieldTestHostComponent,
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

        testHostFixture = TestBed.createComponent(PhoneDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain('+44 1111 123456');
    });

    it('should have tel link', () => {

        expect(testHostComponent).toBeTruthy();

        const phone = '+44 1111 123456';
        const trimmedPhone = '+44 1111 123456'.replace(/\s+/g, '');
        const aElement = testHostFixture.nativeElement.querySelector('a');

        expect(testHostFixture.nativeElement.textContent).toContain(phone);
        expect(aElement).toBeTruthy();
        expect(aElement.href).toContain(`tel:${trimmedPhone}`);
    });

});
