import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IntRecordFieldsComponent} from './int.component';

describe('IntComponent', () => {
    let component: IntRecordFieldsComponent;
    let fixture: ComponentFixture<IntRecordFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IntRecordFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntRecordFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
