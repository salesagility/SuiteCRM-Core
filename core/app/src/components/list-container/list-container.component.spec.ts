import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListcontainerUiComponent} from './list-container.component';

describe('ListcontainerUiComponent', () => {
    let component: ListcontainerUiComponent;
    let fixture: ComponentFixture<ListcontainerUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListcontainerUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListcontainerUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
