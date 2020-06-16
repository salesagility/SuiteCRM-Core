import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {DateDetailFieldComponent} from '@fields/date/templates/detail/date.component';
import {distinctUntilChanged} from 'rxjs/operators';
import {BehaviorSubject, of} from 'rxjs';
import {CommonModule} from '@angular/common';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {Field} from '@fields/field.model';

@Component({
    selector: 'date-detail-field-test-host-component',
    template: '<scrm-date-detail [field]="field"></scrm-date-detail>'
})
class DateDetailFieldTestHostComponent {
    field: Field = {
        type: 'data',
        value: '2020-05-01'
    };
}

describe('DateDetailFieldComponent', () => {
    let testHostComponent: DateDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<DateDetailFieldTestHostComponent>;

    const preferences = new BehaviorSubject({
        // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
        date_format: 'yyyy-MM-dd',
    });


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DateDetailFieldTestHostComponent,
                DateDetailFieldComponent,
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
                    provide: SystemConfigStore, useValue: {
                        configs$: of({
                            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
                            date_format: {
                                id: '/docroot/api/system-configs/date_format',
                                _id: 'date_format',
                                value: 'dd.MM.yyyy',
                                items: []
                            }
                        })
                    }
                }
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(DateDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have user preferences based formatted date', () => {

        expect(testHostComponent).toBeTruthy();

        preferences.next({
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            date_format: 'yyyy-MM-dd',
        });

        testHostComponent.field.value = '2020-04-14';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('2020-04-14');
    });

    it('should have custom formatted date', () => {

        expect(testHostComponent).toBeTruthy();

        preferences.next({
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            date_format: 'yyyy/MM/dd',
        });

        testHostComponent.field.value = '2020-03-15';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('2020/03/15');
    });

    it('should have system config based formatted date', () => {

        expect(testHostComponent).toBeTruthy();

        preferences.next({
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            date_format: null,
        });

        testHostComponent.field.value = '2020-02-16';
        testHostFixture.detectChanges();
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('16.02.2020');
    });

});
