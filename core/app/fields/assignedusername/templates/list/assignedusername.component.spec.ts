import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AssignedusernameListViewComponent} from './assignedusername.component';

describe('AssignedusernameListViewComponent', () => {
    let component: AssignedusernameListViewComponent;
    let fixture: ComponentFixture<AssignedusernameListViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AssignedusernameListViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AssignedusernameListViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
