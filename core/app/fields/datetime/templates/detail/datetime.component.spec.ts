import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {DateTimeDetailFieldComponent} from './datetime.component';
import {CommonModule} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {Field} from '@app-common/record/field.model';
import {DatetimeFormatter} from '@services/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/datetime/datetime-formatter.service.spec.mock';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';

@Component({
    selector: 'datetime-detail-field-test-host-component',
    template: '<scrm-datetime-detail [field]="field"></scrm-datetime-detail>'
})
class DateTimeDetailFieldTestHostComponent {
    field: Field = {
        type: 'datetime',
        value: '2020-05-01 23:23:23'
    };

}

describe('DatetimeDetailFieldComponent', () => {
    let testHostComponent: DateTimeDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<DateTimeDetailFieldTestHostComponent>;

    /* eslint-disable camelcase, @typescript-eslint/camelcase */
    const preferences = new BehaviorSubject({
        date_format: 'yyyy-MM-dd',
        time_format: 'HH:mm:ss',
    });
    /* eslint-enable camelcase, @typescript-eslint/camelcase */

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DateTimeDetailFieldTestHostComponent,
                DateTimeDetailFieldComponent,
            ],
            imports: [
                CommonModule
            ],
            providers: [
                {
                    provide: UserPreferenceStore, useValue: userPreferenceStoreMock
                },
                {
                    provide: DatetimeFormatter, useValue: datetimeFormatterMock
                }
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(DateTimeDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have user preferences based formatted datetime', () => {

        expect(testHostComponent).toBeTruthy();

        /* eslint-disable camelcase, @typescript-eslint/camelcase */
        preferences.next({
            date_format: 'yyyy-MM-dd',
            time_format: 'HH:mm:ss',
        });
        /* eslint-enable camelcase, @typescript-eslint/camelcase */

        testHostComponent.field.value = '2020-04-14 21:11:01';
        testHostFixture.detectChanges();

        expect(testHostFixture.nativeElement.textContent).toContain('14.04.2020 21.11.01');
    });
});
