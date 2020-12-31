import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {MultiEnumFilterFieldComponent} from './multienum.component';
import {FormControl, FormsModule} from '@angular/forms';
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
import {TagInputModule} from 'ngx-chips';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';
import {dataTypeFormatterMock} from '@services/formatters/data-type.formatter.spec.mock';

@Component({
    selector: 'multienum-filter-field-test-host-component',
    template: '<scrm-multienum-filter [field]="field"></scrm-multienum-filter>'
})
class MultiEnumFilterFieldTestHostComponent {
    field: Field = {
        type: 'enum',
        value: null,
        valueList: [
            '_customer',
        ],
        metadata: null,
        definition: {
            options: 'account_type_dom'
        },
        criteria: {
            values: ['_customer'],
            operator: '='
        },
        formControl: new FormControl(['_customer'])
    };
}

describe('MultiEnumFilterFieldComponent', () => {
    let testHostComponent: MultiEnumFilterFieldTestHostComponent;
    let testHostFixture: ComponentFixture<MultiEnumFilterFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MultiEnumFilterFieldTestHostComponent,
                MultiEnumFilterFieldComponent,
            ],
            imports: [
                TagInputModule,
                FormsModule,
                BrowserDynamicTestingModule,
                BrowserAnimationsModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
                {provide: NumberFormatter, useValue: numberFormatterMock},
                {provide: DataTypeFormatter, useValue: dataTypeFormatterMock},
                {provide: DatetimeFormatter, useValue: datetimeFormatterMock},
                {provide: DateFormatter, useValue: dateFormatterMock},
                {
                    provide: CurrencyFormatter,
                    useValue: new CurrencyFormatter(userPreferenceStoreMock, numberFormatterMock, 'en_us')
                },
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(MultiEnumFilterFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

});

