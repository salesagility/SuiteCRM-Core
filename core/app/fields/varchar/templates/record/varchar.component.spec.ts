import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VarcharRecordFieldsComponent} from './varchar.component';

describe('VarcharRecordFieldsComponent', () => {
    let component: VarcharRecordFieldsComponent;
    let fixture: ComponentFixture<VarcharRecordFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VarcharRecordFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VarcharRecordFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});
