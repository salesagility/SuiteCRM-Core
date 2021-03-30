import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonRecordFieldsComponent} from './button.component';

describe('ButtonRecordFieldsComponent', () => {
    let component: ButtonRecordFieldsComponent;
    let fixture: ComponentFixture<ButtonRecordFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ButtonRecordFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ButtonRecordFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});
