import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {EnumEditFieldComponent} from './enum.component';
import {Field} from '@app-common/record/field.model';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {TagInputModule} from 'ngx-chips';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {dateFormatterMock} from '@services/formatters/datetime/date-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';
import {waitUntil} from '@app-common/testing/utils.spec';

@Component({
    selector: 'enum-edit-field-test-host-component',
    template: '<scrm-enum-edit [field]="field"></scrm-enum-edit>'
})
class EnumEditFieldTestHostComponent {
    field: Field = {
        type: 'enum',
        value: '_customer',
        metadata: null,
        definition: {
            options: 'account_type_dom'
        }
    };
}

describe('EnumEditFieldComponent', () => {
    let testHostComponent: EnumEditFieldTestHostComponent;
    let testHostFixture: ComponentFixture<EnumEditFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EnumEditFieldTestHostComponent,
                EnumEditFieldComponent,
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
                {provide: DatetimeFormatter, useValue: datetimeFormatterMock},
                {provide: DateFormatter, useValue: dateFormatterMock},
                {
                    provide: CurrencyFormatter,
                    useValue: new CurrencyFormatter(userPreferenceStoreMock, numberFormatterMock, 'en_us')
                },
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(EnumEditFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', async (done) => {
        expect(testHostComponent).toBeTruthy();

        testHostFixture.detectChanges();
        await testHostFixture.whenRenderingDone();

        const field = testHostFixture.nativeElement.getElementsByTagName('scrm-enum-edit')[0];

        expect(field).toBeTruthy();

        const tagInput = field.getElementsByTagName('tag-input').item(0);

        expect(tagInput).toBeTruthy();

        const tag = tagInput.getElementsByTagName('tag').item(0);

        expect(tag).toBeTruthy();

        const tagText = tag.getElementsByClassName('tag__text').item(0);

        expect(tagText.textContent).toContain('Customer');
        expect(tagText.textContent).not.toContain('_customer');

        const deleteIcon = tagInput.getElementsByTagName('delete-icon').item(0);

        expect(deleteIcon).toBeTruthy();

        done();
    });

    it('should allow removing value', async (done) => {
        expect(testHostComponent).toBeTruthy();

        const element = testHostFixture.nativeElement;

        testHostFixture.detectChanges();
        await testHostFixture.whenRenderingDone();

        const deleteIcon = element.getElementsByTagName('delete-icon').item(0);

        expect(deleteIcon).toBeTruthy();

        deleteIcon.click();

        testHostFixture.detectChanges();
        await testHostFixture.whenStable();

        const field = testHostFixture.nativeElement.getElementsByTagName('scrm-enum-edit')[0];

        expect(field).toBeTruthy();

        await waitUntil(() => !field.getElementsByTagName('tag').item(0));

        const tag = field.getElementsByTagName('tag');

        expect(tag).toBeTruthy();
        expect(tag.length).toEqual(0);

        done();
    });

    it('should allow adding value', async (done) => {
        expect(testHostComponent).toBeTruthy();

        const element = testHostFixture.nativeElement;

        testHostFixture.detectChanges();
        await testHostFixture.whenRenderingDone();

        const deleteIcon = element.getElementsByTagName('delete-icon').item(0);

        expect(deleteIcon).toBeTruthy();

        deleteIcon.click();

        testHostFixture.detectChanges();
        await testHostFixture.whenStable();

        const input = element.getElementsByTagName('tag-input-form').item(0);

        input.click();

        testHostFixture.detectChanges();
        await testHostFixture.whenStable();

        const menu = document.getElementsByClassName('ng2-dropdown-menu').item(0);
        const item = menu.getElementsByClassName('ng2-menu-item').item(0);

        expect(menu).toBeTruthy();
        expect(item).toBeTruthy();

        item.parentElement.click();

        testHostFixture.detectChanges();
        await testHostFixture.whenStable();

        const tag = element.getElementsByTagName('tag').item(0);

        expect(tag).toBeTruthy();

        const tagText = tag.getElementsByClassName('tag__text').item(0);

        expect(tagText.textContent).toContain('Customer');
        expect(tagText.textContent).not.toContain('_customer');

        const newDeleteIcon = element.getElementsByTagName('delete-icon').item(0);

        expect(newDeleteIcon).toBeTruthy();

        done();

    });
});
