import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PaginationUiComponent} from './pagination.component';

describe('PaginationUiComponent', () => {
    let component: PaginationUiComponent;
    let fixture: ComponentFixture<PaginationUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PaginationUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginationUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
