import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BulkactionmenuUiComponent} from './bulk-action-menu.component';

describe('BulkactionmenuUiComponent', () => {
    let component: BulkactionmenuUiComponent;
    let fixture: ComponentFixture<BulkactionmenuUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BulkactionmenuUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BulkactionmenuUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
