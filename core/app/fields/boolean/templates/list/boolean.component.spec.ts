import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BooleanListFieldsComponent} from './boolean.component';

describe('BooleanListFieldsComponent', () => {
    let component: BooleanListFieldsComponent;
    let fixture: ComponentFixture<BooleanListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BooleanListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BooleanListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
