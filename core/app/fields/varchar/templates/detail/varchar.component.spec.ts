import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {VarcharDetailFieldComponent} from './varchar.component';
import {Field} from '@fields/field.model';

@Component({
    selector: 'varchar-detail-field-test-host-component',
    template: '<scrm-varchar-detail [field]="field"></scrm-varchar-detail>'
})
class VarcharDetailFieldTestHostComponent {
    field: Field = {
        value: 'My Varchar',
        type: 'varchar'
    };
}

describe('VarcharDetailFieldComponent', () => {
    let testHostComponent: VarcharDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<VarcharDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                VarcharDetailFieldTestHostComponent,
                VarcharDetailFieldComponent,
            ],
            imports: [],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(VarcharDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain('My Varchar');
    });

});
