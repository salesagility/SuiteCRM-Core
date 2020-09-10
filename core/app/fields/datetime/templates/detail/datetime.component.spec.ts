import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {DateTimeDetailFieldComponent} from './datetime.component';
import {CommonModule} from '@angular/common';
import {distinctUntilChanged} from 'rxjs/operators';
import {BehaviorSubject, of} from 'rxjs';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {Field} from '@app-common/record/field.model';

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
                    provide: UserPreferenceStore, useValue: {
                        userPreferences$: preferences.asObservable().pipe(distinctUntilChanged())
                    }
                },
                {
                    /* eslint-disable camelcase, @typescript-eslint/camelcase */
                    provide: SystemConfigStore, useValue: {
                        configs$: of({
                            date_format: {
                                id: '/docroot/api/system-configs/date_format',
                                _id: 'date_format',
                                value: 'dd.MM.yyyy',
                                items: []
                            },
                            time_format: {
                                id: '/docroot/api/system-configs/time_format',
                                _id: 'time_format',
                                value: 'HH.mm.ss',
                                items: []
                            }
                        })
                        /* eslint-enable camelcase, @typescript-eslint/camelcase */
                    }
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


        expect(testHostFixture.nativeElement.textContent).toContain('2020-04-14 21:11:01');
    });

    it('should have custom formatted datetime', () => {

        expect(testHostComponent).toBeTruthy();

        /* eslint-disable camelcase, @typescript-eslint/camelcase */
        preferences.next({
            date_format: 'yyyy/MM/dd',
            time_format: 'HH-mm',
        });
        /* eslint-enable camelcase, @typescript-eslint/camelcase */

        testHostComponent.field.value = '2020-03-15 23:13:03';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('2020/03/15 23-13');
    });

    it('should have system config based formatted datetime', () => {

        expect(testHostComponent).toBeTruthy();

        /* eslint-disable camelcase, @typescript-eslint/camelcase */
        preferences.next({
            date_format: null,
            time_format: null,
        });
        /* eslint-enable camelcase, @typescript-eslint/camelcase */

        testHostComponent.field.value = '2020-02-16 22:12:02';
        testHostFixture.detectChanges();
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('16.02.2020 22.12.02');
    });

    it('should have formatted datetime with lowercase pm', () => {

        expect(testHostComponent).toBeTruthy();

        /* eslint-disable camelcase, @typescript-eslint/camelcase */
        preferences.next({
            date_format: 'yyyy/MM/dd',
            time_format: 'hh.mm aaaaaa',
        });
        /* eslint-enable camelcase, @typescript-eslint/camelcase */

        testHostComponent.field.value = '2020-02-16 22:12:02';
        testHostFixture.detectChanges();
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('2020/02/16 10.12 pm');
    });

    it('should have formatted datetime with uppercase pm', () => {

        expect(testHostComponent).toBeTruthy();

        /* eslint-disable camelcase, @typescript-eslint/camelcase */
        preferences.next({
            date_format: 'yyyy/MM/dd',
            time_format: 'hh.mm a',
        });
        /* eslint-enable camelcase, @typescript-eslint/camelcase */

        testHostComponent.field.value = '2020-02-16 22:12:02';
        testHostFixture.detectChanges();
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('2020/02/16 10.12 PM');
    });

});
