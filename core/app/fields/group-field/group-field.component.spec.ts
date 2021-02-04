import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {GroupFieldComponent} from './group-field.component';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';
import {currencyFormatterMock} from '@services/formatters/currency/currency-formatter.service.spec.mock';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {systemConfigStoreMock} from '@store/system-config/system-config.store.spec.mock';
import {CommonModule} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import {TagInputModule} from 'ngx-chips';
import {FormControl, FormsModule} from '@angular/forms';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {DynamicFieldModule} from '@fields/dynamic-field/dynamic-field.module';
import {baseFieldModules} from '@fields/base-fields.manifest';
import {Record} from '@app-common/record/record.model';

describe('GroupFieldComponent', () => {
    let component: GroupFieldComponent;
    let fixture: ComponentFixture<GroupFieldComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [GroupFieldComponent],
            imports: [
                ...baseFieldModules,
                CommonModule,
                RouterTestingModule,
                TagInputModule,
                FormsModule,
                BrowserDynamicTestingModule,
                NoopAnimationsModule,
                DynamicFieldModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
                {provide: NumberFormatter, useValue: numberFormatterMock},
                {provide: DatetimeFormatter, useValue: datetimeFormatterMock},
                {provide: CurrencyFormatter, useValue: currencyFormatterMock},
                {provide: SystemConfigStore, useValue: systemConfigStoreMock}
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupFieldComponent);
        component = fixture.componentInstance;

        /* eslint-disable camelcase, @typescript-eslint/camelcase */
        const record = {
            module: 'accounts',
            attributes: {
                billing_address: '',
                billing_address_street: '',
                billing_address_city: '',
            },
            fields: {
                billing_address: {
                    type: 'grouped-field',
                    name: 'billing_address',
                    definition: {
                        groupKey: 'billing',
                        layout: [
                            'billing_address_street',
                            'billing_address_city',
                        ],
                        display: 'vertical',
                        showLabel: [
                            'edit'
                        ],
                        groupFields: {
                            billing_address_street: {
                                name: 'billing_address_street',
                                vname: 'LBL_BILLING_ADDRESS_STREET',
                                type: 'varchar',
                                len: '150',
                                comment: 'The street address used for billing address',
                                group: 'billing_address',
                                merge_filter: 'enabled',
                                required: false
                            },
                            billing_address_city: {
                                name: 'billing_address_city',
                                vname: 'LBL_BILLING_ADDRESS_CITY',
                                type: 'varchar',
                                len: '100',
                                comment: 'The city used for billing address',
                                group: 'billing_address',
                                merge_filter: 'enabled',
                                required: false
                            },
                        },
                    },
                },
                billing_address_street: {
                    name: 'billing_address_street',
                    type: 'varchar',
                    value: 'Sample Street',
                    definition: {
                        name: 'billing_address_street',
                        vname: 'LBL_BILLING_ADDRESS_STREET',
                        type: 'varchar',
                        len: '150',
                        comment: 'The street address used for billing address',
                        group: 'billing_address',
                        merge_filter: 'enabled',
                        required: false
                    },
                    formControl: new FormControl('Sample Street')
                },
                billing_address_city: {
                    name: 'billing_address_city',
                    type: 'varchar',
                    value: 'Sample City',
                    definition: {
                        name: 'billing_address_city',
                        vname: 'LBL_BILLING_ADDRESS_CITY',
                        type: 'varchar',
                        len: '100',
                        comment: 'The city used for billing address',
                        group: 'billing_address',
                        merge_filter: 'enabled',
                        required: false
                    },
                    formControl: new FormControl('Sample City')
                }
            }
        } as Record;

        component.mode = 'detail';
        component.field = record.fields.billing_address;
        component.record = record;
        component.klass = {'test-class': true};
        /* eslint-enable camelcase, @typescript-eslint/camelcase */
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render field component', () => {
        expect(component).toBeTruthy();

        const el = fixture.nativeElement;

        expect(el).toBeTruthy();
        expect(el.textContent).toContain('Sample Street');
        expect(el.textContent).toContain('Sample City');
    });
});
