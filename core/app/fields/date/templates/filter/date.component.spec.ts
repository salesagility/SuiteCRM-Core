import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {Component} from '@angular/core';
import {DateFilterFieldComponent} from '@fields/date/templates/filter/date.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BehaviorSubject, of} from 'rxjs';
import {CommonModule} from '@angular/common';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {Field} from '@app-common/record/field.model';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';

@Component({
    selector: 'date-filter-field-test-host-component',
    template: '<scrm-date-filter></scrm-date-filter>'
})
class DateFilterFieldTestHostComponent {
    field: Field = {
        type: 'date',
        value: '2020-05-01'
    };
}

describe('DateFilterFieldComponent', () => {
    let testHostComponent: DateFilterFieldTestHostComponent;
    let testHostFixture: ComponentFixture<DateFilterFieldTestHostComponent>;

    const preferences = new BehaviorSubject({
        // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
        date_format: 'yyyy-MM-dd',
    });


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                DateFilterFieldTestHostComponent,
                DateFilterFieldComponent,
            ],
            imports: [
                CommonModule,
                NgbModule
            ],
            providers: [
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
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

        testHostFixture = TestBed.createComponent(DateFilterFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));
});
