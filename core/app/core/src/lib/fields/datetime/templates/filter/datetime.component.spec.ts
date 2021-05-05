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
import {Component} from '@angular/core';
import {DateTimeFilterFieldComponent} from './datetime.component';
import {Field} from 'common';
import {FormControl, FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {distinctUntilChanged} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {ButtonModule} from '../../../../components/button/button.module';
import {UserPreferenceStore} from '../../../../store/user-preference/user-preference.store';
import {DateTimeFilterFieldModule} from './datetime.module';
import {datetimeFormatterMock} from '../../../../services/formatters/datetime/datetime-formatter.service.spec.mock';
import {CurrencyFormatter} from '../../../../services/formatters/currency/currency-formatter.service';
import {LanguageStore} from '../../../../store/language/language.store';
import {userPreferenceStoreMock} from '../../../../store/user-preference/user-preference.store.spec.mock';
import {numberFormatterMock} from '../../../../services/formatters/number/number-formatter.spec.mock';
import {themeImagesStoreMock} from '../../../../store/theme-images/theme-images.store.spec.mock';
import {dateFormatterMock} from '../../../../services/formatters/datetime/date-formatter.service.spec.mock';
import {DateFormatter} from '../../../../services/formatters/datetime/date-formatter.service';
import {languageStoreMock} from '../../../../store/language/language.store.spec.mock';
import {DatetimeFormatter} from '../../../../services/formatters/datetime/datetime-formatter.service';
import {ThemeImagesStore} from '../../../../store/theme-images/theme-images.store';
import {NumberFormatter} from '../../../../services/formatters/number/number-formatter.service';

@Component({
    selector: 'datetime-filter-field-test-host-component',
    template: '<scrm-datetime-filter [field]="field"></scrm-datetime-filter>'
})
class DatetimeFilterFieldTestHostComponent {
    field: Field = {
        type: 'datetime',
        value: '2020-11-09 12:12:12',
        formControl: new FormControl('2020-11-09 12:12:12')
    };
}

describe('DateTimeFilterFieldComponent', () => {
    let testHostComponent: DatetimeFilterFieldTestHostComponent;
    let testHostFixture: ComponentFixture<DatetimeFilterFieldTestHostComponent>;

    /* eslint-disable camelcase, @typescript-eslint/camelcase */
    const preferences = new BehaviorSubject({
        date_format: 'yyyy-MM-dd',
        time_format: 'HH:mm:ss',
    });
    /* eslint-enable camelcase, @typescript-eslint/camelcase */

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                DatetimeFilterFieldTestHostComponent,
                DateTimeFilterFieldComponent,
            ],
            imports: [
                FormsModule,
                NgbModule,
                ButtonModule,
                DateTimeFilterFieldModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {
                    provide: UserPreferenceStore, useValue: {
                        userPreferences$: preferences.asObservable().pipe(distinctUntilChanged()),
                        getUserPreference: (key: string): any => {

                            if (!preferences.value || !preferences.value[key]) {
                                return null;
                            }

                            return preferences.value[key];
                        }
                    }
                },
                {
                    provide: DatetimeFormatter, useValue: datetimeFormatterMock
                },
                {provide: NumberFormatter, useValue: numberFormatterMock},
                {provide: DatetimeFormatter, useValue: datetimeFormatterMock},
                {provide: DateFormatter, useValue: dateFormatterMock},
                {
                    provide: CurrencyFormatter,
                    useValue: new CurrencyFormatter(userPreferenceStoreMock, numberFormatterMock, 'en_us')
                },
                {
                    provide: ThemeImagesStore, useValue: themeImagesStoreMock
                }
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(DatetimeFilterFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
