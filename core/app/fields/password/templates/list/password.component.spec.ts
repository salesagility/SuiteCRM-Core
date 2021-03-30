import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordListFieldsComponent} from './password.component';

describe('PasswordListFieldsComponent', () => {
    let component: PasswordListFieldsComponent;
    let fixture: ComponentFixture<PasswordListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PasswordListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PasswordListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
