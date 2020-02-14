import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TablefooterUiComponent} from './table-footer.component';

describe('TablefooterUiComponent', () => {
    let component: TablefooterUiComponent;
    let fixture: ComponentFixture<TablefooterUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TablefooterUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TablefooterUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
