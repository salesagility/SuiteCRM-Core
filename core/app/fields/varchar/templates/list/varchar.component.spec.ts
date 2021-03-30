import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VarcharListFieldsComponent} from './varchar.component';

describe('VarcharListFieldsComponent', () => {
    let component: VarcharListFieldsComponent;
    let fixture: ComponentFixture<VarcharListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VarcharListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VarcharListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
