import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {VarcharEditFieldComponent} from './varchar.component';
import {Field} from '@fields/field.model';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'varchar-edit-field-test-host-component',
    template: '<scrm-varchar-edit [field]="field"></scrm-varchar-edit>'
})
class VarcharEditFieldTestHostComponent {
    field: Field = {
        type: 'varchar',
        value: 'My Varchar'
    };
}

describe('VarcharEditFieldComponent', () => {
    let testHostComponent: VarcharEditFieldTestHostComponent;
    let testHostFixture: ComponentFixture<VarcharEditFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                VarcharEditFieldTestHostComponent,
                VarcharEditFieldComponent,
            ],
            imports: [
                FormsModule
            ],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(VarcharEditFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        const input = testHostFixture.nativeElement.querySelector('input');

        expect(input.value).toContain('My Varchar');
    });

    it('should have update input when field changes', async(() => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.field.value = 'New Field value';

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const input = testHostFixture.nativeElement.querySelector('input');

            expect(input.value).toContain('New Field value');
        });

    }));

    it('should have update field when input changes', async(() => {
        expect(testHostComponent).toBeTruthy();

        const input = testHostFixture.nativeElement.querySelector('input');
        input.value = 'New input value';
        input.dispatchEvent(new Event('input'));

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(testHostComponent.field.value).toContain('New input value');
        });

    }));

});
