import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IntListFieldsComponent} from './int.component';

describe('IntListFieldsComponent', () => {
    let component: IntListFieldsComponent;
    let fixture: ComponentFixture<IntListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IntListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
