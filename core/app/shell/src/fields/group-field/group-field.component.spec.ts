/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {GroupFieldComponent} from './group-field.component';
import {LanguageStore} from 'core';
import {languageStoreMock} from 'core';
import {UserPreferenceStore} from 'core';
import {userPreferenceStoreMock} from 'core';
import {NumberFormatter} from 'core';
import {numberFormatterMock} from 'core';
import {DatetimeFormatter} from 'core';
import {datetimeFormatterMock} from 'core';
import {CurrencyFormatter} from 'core';
import {currencyFormatterMock} from 'core';
import {SystemConfigStore} from 'core';
import {systemConfigStoreMock} from 'core';
import {CommonModule} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import {TagInputModule} from 'ngx-chips';
import {FormControl, FormsModule} from '@angular/forms';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {DynamicFieldModule} from '@fields/dynamic-field/dynamic-field.module';
import {baseFieldModules} from '@fields/base-fields.manifest';
import {Record} from 'common';

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
