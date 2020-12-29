import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {VarcharDetailFieldComponent} from './varchar.component';
import {Field} from '@app-common/record/field.model';
import {HtmlSanitizeModule} from '@base/pipes/html-sanitize/html-sanitize.module';
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
    selector: 'varchar-detail-field-test-host-component',
    template: '<scrm-varchar-detail [field]="field"></scrm-varchar-detail>'
})
class VarcharDetailFieldTestHostComponent {
    field: Field = {
        value: 'My Varchar',
        type: 'varchar'
    };
}

describe('VarcharDetailFieldComponent', () => {
    let testHostComponent: VarcharDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<VarcharDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                VarcharDetailFieldTestHostComponent,
                VarcharDetailFieldComponent,
            ],
            imports: [
                HtmlSanitizeModule
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

        testHostFixture = TestBed.createComponent(VarcharDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain('My Varchar');
    });

});
