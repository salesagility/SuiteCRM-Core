import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {DateDetailFieldComponent} from '@fields/date/templates/detail/date.component';
import {BehaviorSubject} from 'rxjs';
import {CommonModule} from '@angular/common';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {Field} from '@app-common/record/field.model';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {dateFormatterMock} from '@services/formatters/datetime/date-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';

@Component({
    selector: 'date-detail-field-test-host-component',
    template: '<scrm-date-detail [field]="field"></scrm-date-detail>'
})
class DateDetailFieldTestHostComponent {
    field: Field = {
        type: 'data',
        value: '2020-05-01'
    };
}

describe('DateDetailFieldComponent', () => {
    let testHostComponent: DateDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<DateDetailFieldTestHostComponent>;

    const preferences = new BehaviorSubject({
        // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
        date_format: 'yyyy-MM-dd',
    });


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DateDetailFieldTestHostComponent,
                DateDetailFieldComponent,
            ],
            imports: [
                CommonModule
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
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(DateDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have user preferences based formatted date', () => {

        expect(testHostComponent).toBeTruthy();

        preferences.next({
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            date_format: 'yyyy-MM-dd',
        });

        testHostComponent.field.value = '2020-04-14';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('14.04.2020');
    });

    it('should have custom formatted date', () => {

        expect(testHostComponent).toBeTruthy();

        preferences.next({
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            date_format: 'yyyy/MM/dd',
        });

        testHostComponent.field.value = '2020-03-15';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('15.03.2020');
    });
});
