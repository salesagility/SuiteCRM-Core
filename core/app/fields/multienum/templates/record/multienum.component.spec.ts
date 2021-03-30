import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MultienumRecordFieldsComponent} from './multienum.component';

describe('MultienumRecordFieldsComponent', () => {
    let component: MultienumRecordFieldsComponent;
    let fixture: ComponentFixture<MultienumRecordFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MultienumRecordFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultienumRecordFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
