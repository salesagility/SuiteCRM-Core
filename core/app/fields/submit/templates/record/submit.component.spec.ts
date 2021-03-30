import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SubmitRecordFieldsComponent} from './submit.component';

describe('SubmitRecordFieldsComponent', () => {
    let component: SubmitRecordFieldsComponent;
    let fixture: ComponentFixture<SubmitRecordFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SubmitRecordFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SubmitRecordFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
