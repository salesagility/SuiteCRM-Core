import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TablebodyUiComponent} from './table-body.component';

describe('TablebodyUiComponent', () => {
    let component: TablebodyUiComponent;
    let fixture: ComponentFixture<TablebodyUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TablebodyUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TablebodyUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
