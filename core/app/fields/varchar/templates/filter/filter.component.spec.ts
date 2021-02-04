import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component} from '@angular/core';
import {VarcharFilterFieldComponent} from './filter.component';
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
import {VarcharFilterFieldModule} from '@fields/varchar/templates/filter/filter.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'varchar-filter-field-test-host-component',
    template: '<scrm-varchar-filter [field]="field"></scrm-varchar-filter>'
})
class VarcharFilterFieldTestHostComponent {
    field: Field = {
        type: 'varchar',
        value: 'test filter value',
        criteria: {
            values: ['test filter value'],
            operator: '='
        },
        formControl: new FormControl('test filter value')
    };
}

describe('VarcharFilterFieldComponent', () => {
    let testHostComponent: VarcharFilterFieldTestHostComponent;
    let testHostFixture: ComponentFixture<VarcharFilterFieldTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                VarcharFilterFieldTestHostComponent,
                VarcharFilterFieldComponent,
            ],
            imports: [
                VarcharFilterFieldModule,
                NoopAnimationsModule
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

        testHostFixture = TestBed.createComponent(VarcharFilterFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        const input = testHostFixture.nativeElement.querySelector('input');

        expect(input.value).toContain('test filter value');
    });

    it('should have update input when field changes', waitForAsync(() => {
        expect(testHostComponent).toBeTruthy();
        testHostComponent.field.formControl.setValue('New Field value');

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const input = testHostFixture.nativeElement.querySelector('input');

            expect(input.value).toContain('New Field value');
        });

    }));

    it('should have update field when input changes', waitForAsync(() => {
        expect(testHostComponent).toBeTruthy();

        const input = testHostFixture.nativeElement.querySelector('input');
        input.value = 'New input value';
        input.dispatchEvent(new Event('input'));

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(testHostComponent.field.criteria.values[0]).toContain('New input value');
        });

    }));

});
