import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FloatRecordFieldsComponent} from './float.component';

describe('FloatRecordFieldsComponent', () => {
    let component: FloatRecordFieldsComponent;
    let fixture: ComponentFixture<FloatRecordFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FloatRecordFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FloatRecordFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});
