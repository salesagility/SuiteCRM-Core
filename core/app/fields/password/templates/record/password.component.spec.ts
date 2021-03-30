import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordRecordFieldsComponent} from './password.component';

describe('PasswordRecordFieldsComponent', () => {
    let component: PasswordRecordFieldsComponent;
    let fixture: ComponentFixture<PasswordRecordFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PasswordRecordFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PasswordRecordFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});
