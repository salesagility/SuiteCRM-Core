import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TableheaderUiComponent} from './table-header.component';

describe('TableheaderUiComponent', () => {
    let component: TableheaderUiComponent;
    let fixture: ComponentFixture<TableheaderUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TableheaderUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableheaderUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
