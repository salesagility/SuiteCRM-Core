import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterViewUiComponent} from './filter-view.component';

describe('FilterViewUiComponent', () => {
    let component: FilterViewUiComponent;
    let fixture: ComponentFixture<FilterViewUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FilterViewUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FilterViewUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //   expect(component).toBeTruthy();
    // });
});
