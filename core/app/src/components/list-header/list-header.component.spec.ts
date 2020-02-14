import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListheaderUiComponent} from './list-header.component';

describe('ListheaderUiComponent', () => {
    let component: ListheaderUiComponent;
    let fixture: ComponentFixture<ListheaderUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListheaderUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListheaderUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
