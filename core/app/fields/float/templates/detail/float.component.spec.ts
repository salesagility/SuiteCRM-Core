import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {FloatDetailFieldComponent} from './float.component';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {FormatNumberPipe} from '@base/pipes/format-number/format-number.pipe';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
    selector: 'float-detail-field-test-host-component',
    template: '<scrm-float-detail [value]="value"></scrm-float-detail>'
})
class FloatDetailFieldTestHostComponent {
    value = '10';
}

describe('FloatDetailFieldComponent', () => {
    let testHostComponent: FloatDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<FloatDetailFieldTestHostComponent>;

    const preferences = new BehaviorSubject({
        num_grp_sep: ',',
        dec_sep: '.',
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FloatDetailFieldTestHostComponent,
                FloatDetailFieldComponent,
                FormatNumberPipe
            ],
            imports: [],
            providers: [
                {
                    provide: UserPreferenceStore, useValue: {
                        userPreferences$: preferences.asObservable().pipe(distinctUntilChanged())
                    }
                },
                {
                    provide: SystemConfigStore, useValue: {
                        configs$: of({
                            default_number_grouping_seperator: {
                                id: '/docroot/api/system-configs/default_number_grouping_seperator',
                                _id: 'default_number_grouping_seperator',
                                value: ';',
                                items: []
                            },
                            default_decimal_seperator: {
                                id: '/docroot/api/system-configs/default_decimal_seperator',
                                _id: 'default_decimal_seperator',
                                value: ',',
                                items: []
                            }
                        })
                    }
                }
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(FloatDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {

        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain(10);
    });

    it('should have en_us formatted value', () => {

        expect(testHostComponent).toBeTruthy();

        preferences.next({
            num_grp_sep: ',',
            dec_sep: '.',
        });

        testHostComponent.value = '10.500';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('10.5');
    });

    it('should have custom formatted value', () => {

        expect(testHostComponent).toBeTruthy();

        preferences.next({
            num_grp_sep: '.',
            dec_sep: ',',
        });

        testHostComponent.value = '1000.500';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('1.000,5');
    });

    it('should have system config based formatted value', () => {

        expect(testHostComponent).toBeTruthy();

        preferences.next({
            num_grp_sep: null,
            dec_sep: null,
        });

        testHostComponent.value = '2000.500';
        testHostFixture.detectChanges();
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('2;000,5');
    });
});
