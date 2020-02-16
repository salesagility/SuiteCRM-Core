import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TableUiComponent} from './table.component';

describe('TableUiComponent', () => {
    let component: TableUiComponent;
    let fixture: ComponentFixture<TableUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TableUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
