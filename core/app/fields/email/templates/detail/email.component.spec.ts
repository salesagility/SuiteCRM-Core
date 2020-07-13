import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {EmailDetailFieldsComponent} from './email.component';
import {Field} from '@fields/field.model';
import {Component} from '@angular/core';

@Component({
    selector: 'email-detail-field-test-host-component',
    template: '<scrm-email-detail [field]="field"></scrm-email-detail>'
})
class EmailDetailFieldsTestHostComponent {
    field: Field = {
        type: 'email',
        value: 'the.beans.qa@example.tw'
    };
}

describe('EmailDetailFieldsComponent', () => {
    let testHostComponent: EmailDetailFieldsTestHostComponent;
    let testHostFixture: ComponentFixture<EmailDetailFieldsTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EmailDetailFieldsComponent,
                EmailDetailFieldsTestHostComponent
            ]
        }).compileComponents();

        testHostFixture = TestBed.createComponent(EmailDetailFieldsTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
