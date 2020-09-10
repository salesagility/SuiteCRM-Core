import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {EmailDetailFieldsComponent} from './email.component';
import {Component} from '@angular/core';
import {Field} from '@app-common/record/field.model';

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
