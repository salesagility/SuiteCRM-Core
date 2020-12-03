import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {EmailListFieldsComponent} from './email.component';
import {Component} from '@angular/core';
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
    selector: 'email-list-field-test-host-component',
    template: '<scrm-email-list [field]="field"></scrm-email-list>'
})
class EmailListFieldsTestHostComponent {
    field: Field = {
        type: 'email',
        value: 'the.beans.qa@example.tw'
    };
}

describe('EmailListFieldsComponent', () => {
    let testHostComponent: EmailListFieldsTestHostComponent;
    let testHostFixture: ComponentFixture<EmailListFieldsTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                EmailListFieldsComponent,
                EmailListFieldsTestHostComponent
            ],
            providers: [
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
                {provide: NumberFormatter, useValue: numberFormatterMock},
                {provide: DatetimeFormatter, useValue: datetimeFormatterMock},
                {provide: DateFormatter, useValue: dateFormatterMock},
                {
                    provide: CurrencyFormatter,
                    useValue: new CurrencyFormatter(userPreferenceStoreMock, numberFormatterMock, 'en_us')
                },
            ]
        }).compileComponents();

        testHostFixture = TestBed.createComponent(EmailListFieldsTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain('the.beans.qa@example.tw');
    });

    it('should have formatted email address', () => {
        expect(testHostComponent).toBeTruthy();

        const email = 'the.beans.qa@example.tw';
        const aElement = testHostFixture.nativeElement.querySelector('a');

        expect(testHostFixture.nativeElement.textContent).toContain(email);
        expect(aElement).toBeTruthy();
        expect(aElement.href).toContain(`mailto:${email}`);
    });
});
