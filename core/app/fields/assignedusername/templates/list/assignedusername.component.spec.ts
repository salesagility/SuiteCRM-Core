import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AssignedusernameListFieldsComponent} from './assignedusername.component';

describe('AssignedusernameListFieldsComponent', () => {
    let component: AssignedusernameListFieldsComponent;
    let fixture: ComponentFixture<AssignedusernameListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AssignedusernameListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AssignedusernameListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
