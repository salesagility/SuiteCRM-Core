import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonListFieldsComponent} from './button.component';

describe('ButtonListFieldsComponent', () => {
    let component: ButtonListFieldsComponent;
    let fixture: ComponentFixture<ButtonListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ButtonListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ButtonListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
