import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FieldComponent} from './field.component';
import {DynamicModule} from 'ng-dynamic-component';
import {fieldComponents, fieldModules} from '@fields/field.manifest';
import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';

@Component({
    selector: 'field-test-host-component',
    template: `
        <div id="wrapper">
            <div *ngFor="let wrapper of fields" [id]="wrapper.field.type + '-' + wrapper.mode">
                <scrm-field [mode]="wrapper.mode" [type]="wrapper.field.type" [field]="wrapper.field"></scrm-field>
            </div>
        </div>`
})
class FieldTestHostComponent {
    value = '10';
    fields = [
        {field: {type: 'varchar', value: 'My Varchar'}, mode: 'detail', expected: 'My Varchar'},
        {field: {type: 'varchar', value: 'My Varchar'}, mode: 'list', expected: 'My Varchar'},
        {field: {type: 'varchar', value: 'My Varchar'}, mode: 'edit', expected: 'My Varchar'},
        {field: {type: 'varchar', criteria: {values: ['test'], operator: '='}}, mode: 'filter', expected: 'test'},
        {field: {type: 'int', value: '10'}, mode: 'detail', expected: '10'},
        {field: {type: 'int', value: '10'}, mode: 'list', expected: '10'},
        {field: {type: 'float', value: '1000.5'}, mode: 'detail', expected: '1,000.5'},
        {field: {type: 'float', value: '1000.5'}, mode: 'list', expected: '1,000.5'},
        {field: {type: 'phone', value: '+44 1111 123456'}, mode: 'detail', expected: '+44 1111 123456'},
        {field: {type: 'phone', value: '+44 1111 123456'}, mode: 'list', expected: '+44 1111 123456'},
        {field: {type: 'date', value: '2020-05-15 23:11:01'}, mode: 'detail', expected: '2020-05-15'},
        {field: {type: 'date', value: '2020-05-16 23:11:01'}, mode: 'list', expected: '2020-05-16'},
        {field: {type: 'datetime', value: '2020-05-14 23:11:01'}, mode: 'detail', expected: '2020-05-14 23:11:01'},
        {field: {type: 'datetime', value: '2020-05-13 23:12:02'}, mode: 'list', expected: '2020-05-13 23:12:02'},
        {field: {type: 'url', value: 'https://suitecrm.com/'}, mode: 'detail', expected: 'https://suitecrm.com/'},
        {field: {type: 'url', value: 'https://suitecrm.com/'}, mode: 'list', expected: 'https://suitecrm.com/'},
        {field: {type: 'currency', value: '1000.5'}, mode: 'detail', expected: '£1,000.5'},
        {field: {type: 'currency', value: '1000.5'}, mode: 'list', expected: '£1,000.5'},
        {field: {type: 'text', value: 'My Text'}, mode: 'detail', expected: 'My Text'}
    ];
}

describe('FieldComponent', () => {
    let testHostComponent: FieldTestHostComponent;
    let testHostFixture: ComponentFixture<FieldTestHostComponent>;

    /* eslint-disable camelcase, @typescript-eslint/camelcase */
    const preferences = new BehaviorSubject({
        num_grp_sep: ',',
        dec_sep: '.',
        date_format: 'yyyy-MM-dd',
        time_format: 'HH:mm:ss',
        currency: {id: '1', name: 'Stirling Pound', symbol: '£', iso4217: 'GBP'},
        default_currency_significant_digits: 2
    });
    /* eslint-enable camelcase, @typescript-eslint/camelcase */

    /* eslint-disable camelcase, @typescript-eslint/camelcase */
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FieldComponent, FieldTestHostComponent],
            imports: [
                ...fieldModules,
                CommonModule,
                DynamicModule.withComponents(fieldComponents),
                RouterTestingModule
            ],
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
                            },
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
                            },
                            currency: {
                                id: '/docroot/api/system-configs/currency',
                                _id: 'currency',
                                value: null,
                                items: {
                                    id: '-99',
                                    name: 'US Dollars',
                                    symbol: '$',
                                    iso4217: 'USD'
                                }
                            },
                            default_currency_significant_digits: {
                                id: '/docroot/api/system-configs/default_currency_significant_digits',
                                _id: 'default_currency_significant_digits',
                                value: 3,
                                items: []
                            }
                        })
                    }
                }
            ],
        })
            .compileComponents();
        /* eslint-enable camelcase, @typescript-eslint/camelcase */

        testHostFixture = TestBed.createComponent(FieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create the dynamic component', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should render components', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.fields.forEach((fieldWrapper) => {
            let selector = '#' + fieldWrapper.field.type + '-' + fieldWrapper.mode;

            if (fieldWrapper.mode === 'edit' || fieldWrapper.mode === 'filter') {

                selector += ' input';
                const el = testHostFixture.debugElement.query(By.css(selector)).nativeElement;

                expect(el).toBeTruthy();
                expect(el.value).toContain(fieldWrapper.expected);
            } else {
                const el = testHostFixture.debugElement.query(By.css(selector)).nativeElement;

                expect(el).toBeTruthy();
                expect(el.textContent).toContain(fieldWrapper.expected);
            }
        });
    });
});

