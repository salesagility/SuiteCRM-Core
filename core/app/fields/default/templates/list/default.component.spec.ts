import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DefaultListFieldsComponent} from './default.component';

describe('DefaultListFieldsComponent', () => {
    let component: DefaultListFieldsComponent;
    let fixture: ComponentFixture<DefaultListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefaultListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefaultListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
