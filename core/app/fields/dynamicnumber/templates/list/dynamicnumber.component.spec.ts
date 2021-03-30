import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DynamicnumberListFieldsComponent} from './dynamicnumber.component';

describe('DynamicnumberListFieldsComponent', () => {
    let component: DynamicnumberListFieldsComponent;
    let fixture: ComponentFixture<DynamicnumberListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DynamicnumberListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicnumberListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
