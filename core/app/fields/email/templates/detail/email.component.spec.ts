import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {EmailDetailFieldsComponent} from './email.component';
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
    selector: 'email-detail-field-test-host-component',
    template: '<scrm-email-detail [field]="field"></scrm-email-detail>'
})
class EmailDetailFieldsTestHostComponent {
    field: Field = {
        type: 'email',
        value: 'the.beans.qa@example.tw'
    };
}

describe('EmailDetailFieldsComponent', () => {
    let testHostComponent: EmailDetailFieldsTestHostComponent;
    let testHostFixture: ComponentFixture<EmailDetailFieldsTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                EmailDetailFieldsComponent,
                EmailDetailFieldsTestHostComponent
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

        testHostFixture = TestBed.createComponent(EmailDetailFieldsTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
