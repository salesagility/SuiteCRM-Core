import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BooleanRecordFieldsComponent} from './boolean.component';

describe('BooleanRecordFieldsComponent', () => {
    let component: BooleanRecordFieldsComponent;
    let fixture: ComponentFixture<BooleanRecordFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BooleanRecordFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BooleanRecordFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
