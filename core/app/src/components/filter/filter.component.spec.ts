import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterUiComponent} from './filter.component';

describe('FilterUiComponent', () => {
    let component: FilterUiComponent;
    let fixture: ComponentFixture<FilterUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FilterUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FilterUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //   expect(component).toBeTruthy();
    // });
});
