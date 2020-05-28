import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {PhoneDetailFieldComponent} from './phone.component';

@Component({
    selector: 'phone-detail-field-test-host-component',
    template: '<scrm-phone-detail [value]="value"></scrm-phone-detail>'
})
class PhoneDetailFieldTestHostComponent {
    value = '+44 1111 123456';
}

describe('PhoneDetailFieldComponent', () => {
    let testHostComponent: PhoneDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<PhoneDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PhoneDetailFieldComponent,
                PhoneDetailFieldTestHostComponent,
            ],
            imports: [],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(PhoneDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain('+44 1111 123456');
    });

    it('should have tel link', () => {

        expect(testHostComponent).toBeTruthy();

        const phone = '+44 1111 123456';
        const trimmedPhone = '+44 1111 123456'.replace(/\s+/g,'');
        const aElement = testHostFixture.nativeElement.querySelector('a');

        expect(testHostFixture.nativeElement.textContent).toContain(phone);
        expect(aElement).toBeTruthy();
        expect(aElement.href).toContain(`tel:${trimmedPhone}`);
    });

});
