import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {DateTimeEditFieldComponent} from './datetime.component';
import {Field} from '@app-common/record/field.model';
import {FormsModule} from '@angular/forms';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ButtonModule} from '@components/button/button.module';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesStoreMock} from '@store/theme-images/theme-images.store.spec.mock';
import {distinctUntilChanged} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'datetime-edit-field-test-host-component',
    template: '<scrm-datetime-edit [field]="field"></scrm-datetime-edit>'
})
class DatetimeEditFieldTestHostComponent {
    field: Field = {
        type: 'datetime',
        value: '2020-11-09 12:12:12'
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DatetimeEditFieldTestHostComponent,
                DateTimeEditFieldComponent,
            ],
            imports: [
                FormsModule,
                NgbModule,
                ButtonModule
            ],
            providers: [
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
