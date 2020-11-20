import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {BooleanDetailFieldComponent} from './boolean.component';
import {Field} from '@app-common/record/field.model';
import {HtmlSanitizeModule} from '@base/pipes/html-sanitize/html-sanitize.module';

@Component({
    selector: 'boolean-detail-field-test-host-component',
    template: '<scrm-boolean-detail [field]="field"></scrm-boolean-detail>'
})
class BooleanDetailFieldTestHostComponent {
    field: Field = {
        type: 'boolean',
        value: 'true'
    };
}

describe('BooleanDetailFieldComponent', () => {
    let testHostComponent: BooleanDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<BooleanDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BooleanDetailFieldTestHostComponent,
                BooleanDetailFieldComponent,
            ],
            imports: [
                HtmlSanitizeModule
            ],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(BooleanDetailFieldTestHostComponent);
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
            const input = testHostFixture.nativeElement.querySelector('input');
            const container = testHostFixture.nativeElement.querySelector('.checkbox-container');

            expect(container).toBeTruthy();
            expect(input).toBeTruthy();
            expect(input.checked).toBeTruthy();
            expect(input.type).toContain('checkbox');
            expect(input.disabled).toBeTruthy();
            expect(input.readOnly).toBeTruthy();
        });

    });

    it('should have update input when field changes', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.field.value = 'true';

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const input = testHostFixture.nativeElement.querySelector('input');

            expect(input.checked).toBeTruthy();

            testHostComponent.field.value = 'false';

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {
                expect(input.checked).toBeFalsy();
            });
        });

    });

    it('should not update field when clicked', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.field.value = 'false';

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const input = testHostFixture.nativeElement.querySelector('input');
            input.click();

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {
                expect(testHostComponent.field.value).toContain('false');
            });
        });
    });

});
