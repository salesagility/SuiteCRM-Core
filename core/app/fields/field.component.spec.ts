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


@Component({
    selector: 'field-test-host-component',
    template: `
        <div id="wrapper">
            <div *ngFor="let field of fields" [id]="field.type + '-' + field.mode">
                <scrm-field [mode]="field.mode" [type]="field.type" [value]="field.value"></scrm-field>
            </div>
        </div>`
})
class FieldTestHostComponent {
    value = '10';
    fields = [
        {type: 'varchar', mode: 'detail', value: 'My Varchar', expected: 'My Varchar'},
        {type: 'varchar', mode: 'list', value: 'My Varchar', expected: 'My Varchar'},
        {type: 'int', mode: 'detail', value: '10', expected: '10'},
        {type: 'int', mode: 'list', value: '10', expected: '10'},
        {type: 'float', mode: 'detail', value: '1000.5', expected: '1,000.5'},
        {type: 'float', mode: 'list', value: '1000.5', expected: '1,000.5'},
        {type: 'phone', mode: 'detail', value: '+44 1111 123456', expected: '+44 1111 123456'},
        {type: 'phone', mode: 'list', value: '+44 1111 123456', expected: '+44 1111 123456'},
        {type: 'date', mode: 'detail', value: '2020-05-15 23:11:01', expected: '2020-05-15'},
        {type: 'date', mode: 'list', value: '2020-05-16 23:11:01', expected: '2020-05-16'},
        {type: 'datetime', mode: 'detail', value: '2020-05-14 23:11:01', expected: '2020-05-14 23:11:01'},
        {type: 'datetime', mode: 'list', value: '2020-05-13 23:12:02', expected: '2020-05-13 23:12:02'}
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
    });
    /* eslint-enable camelcase, @typescript-eslint/camelcase */

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FieldComponent, FieldTestHostComponent],
            imports: [
                ...fieldModules,
                CommonModule,
                DynamicModule.withComponents(fieldComponents)
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
                            }
                        })
                    }
                }
            ],
        })
            .compileComponents();

        testHostFixture = TestBed.createComponent(FieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create the dynamic component', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should render components', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.fields.forEach((field) => {
            const selector = '#' + field.type + '-' + field.mode;
            const el = testHostFixture.debugElement.query(By.css(selector)).nativeElement;

            expect(el).toBeTruthy();
            expect(el.textContent).toContain(field.expected);
        });
    });
});

