import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FloatListViewComponent} from './float.component';

describe('FloatListViewComponent', () => {
    let component: FloatListViewComponent;
    let fixture: ComponentFixture<FloatListViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FloatListViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FloatListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
