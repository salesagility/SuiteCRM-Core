import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IntDetailFieldComponent} from './int.component';
import {Component} from '@angular/core';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {BehaviorSubject, of} from 'rxjs';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {FormatNumberPipe} from '@base/pipes/format-number/format-number.pipe';
import {Field} from '@app-common/record/field.model';


@Component({
    selector: 'int-detail-field-test-host-component',
    template: '<scrm-int-detail [field]="field"></scrm-int-detail>'
})
class IntDetailFieldTestHostComponent {
    field: Field = {
        type: 'int',
        value: '10'
    };
}

describe('IntDetailFieldComponent', () => {
    let testHostComponent: IntDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<IntDetailFieldTestHostComponent>;

    /* eslint-disable camelcase,@typescript-eslint/camelcase */
    const preferences = new BehaviorSubject({
        num_grp_sep: ',',
        dec_sep: '.',
    });
    /* eslint-enable camelcase,@typescript-eslint/camelcase */

    beforeEach(async(() => {
        /* eslint-disable camelcase,@typescript-eslint/camelcase */
        TestBed.configureTestingModule({
            declarations: [
                IntDetailFieldTestHostComponent,
                IntDetailFieldComponent,
                FormatNumberPipe
            ],
            imports: [],
            providers: [
                {
                    provide: UserPreferenceStore, useValue: {
                        userPreferences$: preferences.asObservable()
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
        /* eslint-enable camelcase,@typescript-eslint/camelcase */

        testHostFixture = TestBed.createComponent(IntDetailFieldTestHostComponent);
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
});
