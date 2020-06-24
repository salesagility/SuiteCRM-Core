import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {EmailListFieldsComponent} from './email.component';
import {Field} from '@fields/field.model';
import {Component} from '@angular/core';

@Component({
    selector: 'email-list-field-test-host-component',
    template: '<scrm-email-list [field]="field"></scrm-email-list>'
})
class EmailListFieldsTestHostComponent {
    field: Field = {
        type: 'email',
        value: 'the.beans.qa@example.tw'
    };
}

describe('EmailListFieldsComponent', () => {
    let testHostComponent: EmailListFieldsTestHostComponent;
    let testHostFixture: ComponentFixture<EmailListFieldsTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EmailListFieldsComponent,
                EmailListFieldsTestHostComponent
            ]
        }).compileComponents();

        testHostFixture = TestBed.createComponent(EmailListFieldsTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain('the.beans.qa@example.tw');
    });

    it('should have formatted email address', () => {
        expect(testHostComponent).toBeTruthy();

        const email = 'the.beans.qa@example.tw';
        const aElement = testHostFixture.nativeElement.querySelector('a');

        expect(testHostFixture.nativeElement.textContent).toContain(email);
        expect(aElement).toBeTruthy();
        expect(aElement.href).toContain(`mailto:${email}`);
    });
});
