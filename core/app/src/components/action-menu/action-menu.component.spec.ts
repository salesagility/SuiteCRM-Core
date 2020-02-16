import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ActionmenuUiComponent} from './action-menu.component';

describe('ActionmenuUiComponent', () => {
    let component: ActionmenuUiComponent;
    let fixture: ComponentFixture<ActionmenuUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ActionmenuUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActionmenuUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
