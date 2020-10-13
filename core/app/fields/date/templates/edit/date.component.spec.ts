import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {DateEditFieldComponent} from '@fields/date/templates/edit/date.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BehaviorSubject, of} from 'rxjs';
import {CommonModule} from '@angular/common';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {Field} from '@app-common/record/field.model';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';

@Component({
    selector: 'date-edit-field-test-host-component',
    template: '<scrm-date-edit></scrm-date-edit>'
})
class DateEditFieldTestHostComponent {
    field: Field = {
        type: 'data',
        value: '2020-05-01'
    };
}

describe('DateEditFieldComponent', () => {
    let testHostComponent: DateEditFieldTestHostComponent;
    let testHostFixture: ComponentFixture<DateEditFieldTestHostComponent>;

    const preferences = new BehaviorSubject({
        // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
        date_format: 'yyyy-MM-dd',
    });


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DateEditFieldTestHostComponent,
                DateEditFieldComponent,
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

        testHostFixture = TestBed.createComponent(DateEditFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));
});
