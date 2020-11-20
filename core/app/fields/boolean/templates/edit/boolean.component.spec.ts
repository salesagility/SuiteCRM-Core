import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {BooleanEditFieldComponent} from './boolean.component';
import {Field} from '@app-common/record/field.model';

@Component({
    selector: 'boolean-edit-field-test-host-component',
    template: '<scrm-boolean-edit [field]="field"></scrm-boolean-edit>'
})
class BooleanEditFieldTestHostComponent {
    field: Field = {
        type: 'boolean',
        value: 'true'
    };
}

describe('BooleanEditFieldComponent', () => {
    let testHostComponent: BooleanEditFieldTestHostComponent;
    let testHostFixture: ComponentFixture<BooleanEditFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BooleanEditFieldTestHostComponent,
                BooleanEditFieldComponent,
            ],
            imports: [],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(BooleanEditFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have checkbox', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.field.value = 'true';

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const container = testHostFixture.nativeElement.querySelector('.checkbox-container');
            const input = testHostFixture.nativeElement.querySelector('input');

            expect(container).toBeTruthy();
            expect(input).toBeTruthy();
            expect(input.checked).toBeTruthy();
            expect(input.type).toContain('checkbox');
            expect(input.disabled).toBeFalsy();
            expect(input.readOnly).toBeFalsy();
        });
    });

    it('should have updated input when field changes', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.field.value = 'false';

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const input = testHostFixture.nativeElement.querySelector('input');

            expect(input.checked).toBeFalsy();

            testHostComponent.field.value = 'true';

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {
                expect(input.checked).toBeTruthy();
            });
        });

    });

    it('should have update field when input changes', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.field.value = 'false';

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const input = testHostFixture.nativeElement.querySelector('input');
            input.click();

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {
                expect(testHostComponent.field.value).toContain('true');
            });
        });
    });

});
