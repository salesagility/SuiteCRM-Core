import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FloatListFieldsComponent} from './float.component';

describe('FloatListViewComponent', () => {
    let component: FloatListFieldsComponent;
    let fixture: ComponentFixture<FloatListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FloatListFieldsComponent]
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
