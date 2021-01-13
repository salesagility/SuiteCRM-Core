import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {Field} from '@app-common/record/field.model';
import {Record} from '@app-common/record/record.model';
import {RouterTestingModule} from '@angular/router/testing';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {dateFormatterMock} from '@services/formatters/datetime/date-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';
import {currencyFormatterMock} from '@services/formatters/currency/currency-formatter.service.spec.mock';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {RecordListStoreFactory} from '@store/record-list/record-list.store.factory';
import {listStoreFactoryMock} from '@store/record-list/record-list.store.spec.mock';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RelateEditFieldModule} from '@fields/relate/templates/edit/relate.module';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {moduleNameMapperMock} from '@services/navigation/module-name-mapper/module-name-mapper.service.spec.mock';
import {waitUntil} from '@app-common/testing/utils.spec';

@Component({
    selector: 'relate-edit-field-test-host-component',
    template: '<scrm-relate-edit [field]="field" [record]="record"></scrm-relate-edit>'
})
class RelateEditFieldTestHostComponent {
    field: Field = {
        type: 'relate',
        value: 'Related Account',
        valueObject: {
            id: '123',
            name: 'Related Account',
        },
        definition: {
            module: 'accounts',
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            id_name: 'account_id',
            rname: 'name'
        }
    };

    record: Record = {
        type: '',
        module: 'contacts',
        attributes: {
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            contact_id: '1'
        }
    };
}

describe('RelateRecordEditFieldComponent', () => {
    let testHostComponent: RelateEditFieldTestHostComponent;
    let testHostFixture: ComponentFixture<RelateEditFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                RelateEditFieldTestHostComponent,
            ],
            imports: [
                RouterTestingModule,
                RelateEditFieldModule,
                BrowserDynamicTestingModule,
                NoopAnimationsModule
            ],
            providers: [
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
                {provide: NumberFormatter, useValue: numberFormatterMock},
                {provide: DatetimeFormatter, useValue: datetimeFormatterMock},
                {provide: DateFormatter, useValue: dateFormatterMock},
                {provide: CurrencyFormatter, useValue: currencyFormatterMock},
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: RecordListStoreFactory, useValue: listStoreFactoryMock},
                {provide: ModuleNameMapper, useValue: moduleNameMapperMock},
            ],
        })
            .compileComponents();

        testHostFixture = TestBed.createComponent(RelateEditFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', async (done) => {
        expect(testHostComponent).toBeTruthy();

        testHostFixture.detectChanges();

        const field = testHostFixture.nativeElement.getElementsByTagName('scrm-relate-edit')[0];


        await waitUntil(() => field.getElementsByTagName('tag-input').item(0));

        const tagInput = field.getElementsByTagName('tag-input').item(0);

        expect(field).toBeTruthy();

        expect(tagInput).toBeTruthy();

        const tag = tagInput.getElementsByTagName('tag').item(0);

        expect(tag).toBeTruthy();

        const tagText = tag.getElementsByClassName('tag__text').item(0);

        expect(tagText.textContent).toContain('Related Account');

        const deleteIcon = tagInput.getElementsByTagName('delete-icon').item(0);

        expect(deleteIcon).toBeTruthy();

        done();
    });

    it('should remove value', async (done) => {
        expect(testHostComponent).toBeTruthy();

        testHostFixture.detectChanges();

        const field = testHostFixture.nativeElement.getElementsByTagName('scrm-relate-edit')[0];

        await testHostFixture.whenStable();
        await waitUntil(() => field.getElementsByTagName('tag-input').item(0));

        const tagInput = field.getElementsByTagName('tag-input').item(0);

        expect(field).toBeTruthy();

        expect(tagInput).toBeTruthy();

        let tag = tagInput.getElementsByTagName('tag').item(0);

        expect(tag).toBeTruthy();

        const tagText = tag.getElementsByClassName('tag__text').item(0);

        expect(tagText.textContent).toContain('Related Account');

        const deleteIcon = tagInput.getElementsByTagName('delete-icon').item(0);

        expect(deleteIcon).toBeTruthy();

        deleteIcon.click();

        testHostFixture.detectChanges();

        await waitUntil(() => !(tagInput.getElementsByTagName('tag').item(0)));

        tag = tagInput.getElementsByTagName('tag').item(0);

        expect(tag).toBeFalsy();

        done();
    });

});
