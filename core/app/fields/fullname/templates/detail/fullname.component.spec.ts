import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {FullNameDetailFieldsComponent} from './fullname.component';
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
import {Record} from '@app-common/record/record.model';

@Component({
    selector: 'fullname-detail-field-test-host-component',
    template: '<scrm-fullname-detail [field]="field" [record]="record"></scrm-fullname-detail>'
})
class FullNameDetailFieldTestHostComponent {
    field: Field = {
        type: 'fullname',
        value: 'salutation, first_name, last_name',
    };
    record = {
        type: '',
        module: 'leads',
        attributes: {
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            salutation: 'User',
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            first_name: 'Test',
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            last_name: 'Name',
        }
    } as Record;
}

describe('FullNameDetailFieldsComponent', () => {
    let testHostComponent: FullNameDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<FullNameDetailFieldTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                FullNameDetailFieldTestHostComponent,
                FullNameDetailFieldsComponent,
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
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(FullNameDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
