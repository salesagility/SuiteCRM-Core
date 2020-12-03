import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {Component} from '@angular/core';
import {DateTimeEditFieldComponent} from './datetime.component';
import {Field} from '@app-common/record/field.model';
import {FormControl, FormsModule} from '@angular/forms';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ButtonModule} from '@components/button/button.module';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesStoreMock} from '@store/theme-images/theme-images.store.spec.mock';
import {distinctUntilChanged} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {dateFormatterMock} from '@services/formatters/datetime/date-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';
import {DateTimeEditFieldModule} from '@fields/datetime/templates/edit/datetime.module';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';

@Component({
    selector: 'datetime-edit-field-test-host-component',
    template: '<scrm-datetime-edit [field]="field"></scrm-datetime-edit>'
})
class DatetimeEditFieldTestHostComponent {
    field: Field = {
        type: 'datetime',
        value: '2020-11-09 12:12:12',
        formControl: new FormControl('2020-11-09 12:12:12')
    };
}

describe('DateTimeEditFieldComponent', () => {
    let testHostComponent: DatetimeEditFieldTestHostComponent;
    let testHostFixture: ComponentFixture<DatetimeEditFieldTestHostComponent>;

    /* eslint-disable camelcase, @typescript-eslint/camelcase */
    const preferences = new BehaviorSubject({
        date_format: 'yyyy-MM-dd',
        time_format: 'HH:mm:ss',
    });
    /* eslint-enable camelcase, @typescript-eslint/camelcase */

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                DatetimeEditFieldTestHostComponent,
                DateTimeEditFieldComponent,
            ],
            imports: [
                FormsModule,
                NgbModule,
                ButtonModule,
                DateTimeEditFieldModule
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

        testHostFixture = TestBed.createComponent(DatetimeEditFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
