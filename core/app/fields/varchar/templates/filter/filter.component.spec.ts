import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {VarcharFilterFieldComponent} from './filter.component';
import {Field} from '@fields/field.model';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'varchar-filter-field-test-host-component',
    template: '<scrm-varchar-filter [field]="field"></scrm-varchar-filter>'
})
class VarcharFilterFieldTestHostComponent {
    field: Field = {
        type: 'varchar',
        criteria: {
            values: ['test filter value'],
            operator: '='
        }
    };
}

describe('VarcharFilterFieldComponent', () => {
    let testHostComponent: VarcharFilterFieldTestHostComponent;
    let testHostFixture: ComponentFixture<VarcharFilterFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                VarcharFilterFieldTestHostComponent,
                VarcharFilterFieldComponent,
            ],
            imports: [
                FormsModule
            ],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(VarcharFilterFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        const input = testHostFixture.nativeElement.querySelector('input');

        expect(input.value).toContain('test filter value');
    });

    it('should have update input when field changes', async(() => {
        expect(testHostComponent).toBeTruthy();
        testHostComponent.field.criteria.values = ['New Field value'];

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
            expect(testHostComponent.field.criteria.values[0]).toContain('New input value');
        });

    }));

});
