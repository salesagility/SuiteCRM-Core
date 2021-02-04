import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component} from '@angular/core';
import {BooleanFilterFieldComponent} from './boolean.component';
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
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {waitUntil} from '@app-common/testing/utils.spec';


@Component({
    selector: 'boolean-filter-field-test-host-component',
    template: '<scrm-boolean-filter [field]="field"></scrm-boolean-filter>'
})
class BooleanFilterFieldTestHostComponent {
    field: Field = {
        type: 'boolean',
        value: '1',
        metadata: null,
        definition: {
            options: 'dom_int_bool'
        },
        criteria: {
            values: ['1'],
            operator: '='
        },
        formControl: new FormControl('1')
    };
}

describe('BooleanFilterFieldComponent', () => {
    let testHostComponent: BooleanFilterFieldTestHostComponent;
    let testHostFixture: ComponentFixture<BooleanFilterFieldTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                BooleanFilterFieldTestHostComponent,
                BooleanFilterFieldComponent,
            ],
            imports: [
                TagInputModule,
                FormsModule,
                BrowserDynamicTestingModule,
                NoopAnimationsModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
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

        testHostFixture = TestBed.createComponent(BooleanFilterFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', async (done) => {
        expect(testHostComponent).toBeTruthy();

        testHostFixture.detectChanges();

        const field = testHostFixture.nativeElement.getElementsByTagName('scrm-boolean-filter')[0];

        expect(field).toBeTruthy();

        await waitUntil(() => field.getElementsByTagName('tag-input').item(0));

        const tagInput = field.getElementsByTagName('tag-input').item(0);

        expect(tagInput).toBeTruthy();

        const tag = tagInput.getElementsByTagName('tag').item(0);

        expect(tag).toBeTruthy();

        const tagText = tag.getElementsByClassName('tag__text').item(0);

        expect(tagText.textContent).toContain('Yes');
        expect(tagText.textContent).not.toContain('1');

        const deleteIcon = tagInput.getElementsByTagName('delete-icon').item(0);

        expect(deleteIcon).toBeTruthy();

        done();

    });

});
