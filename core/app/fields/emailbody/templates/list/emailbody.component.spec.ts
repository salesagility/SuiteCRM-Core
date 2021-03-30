import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EmailbodyListFieldsComponent} from './emailbody.component';

describe('EmailbodyListFieldsComponent', () => {
    let component: EmailbodyListFieldsComponent;
    let fixture: ComponentFixture<EmailbodyListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EmailbodyListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EmailbodyListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
