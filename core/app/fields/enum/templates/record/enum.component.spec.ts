import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnumRecordFieldsComponent} from './enum.component';

describe('EnumRecordFieldsComponent', () => {
    let component: EnumRecordFieldsComponent;
    let fixture: ComponentFixture<EnumRecordFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EnumRecordFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EnumRecordFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
