import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {VarcharDetailFieldComponent} from './varchar.component';
import {Field} from '@app-common/record/field.model';
import {HtmlSanitizeModule} from '@base/pipes/html-sanitize/html-sanitize.module';

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
            imports: [
                HtmlSanitizeModule
            ],
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
