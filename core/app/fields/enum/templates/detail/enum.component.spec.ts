import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {EnumDetailFieldComponent} from './enum.component';
import {Field} from '@app-common/record/field.model';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';

@Component({
    selector: 'enum-detail-field-test-host-component',
    template: '<scrm-enum-detail [field]="field"></scrm-enum-detail>'
})
class EnumDetailFieldTestHostComponent {
    field: Field = {
        type: 'enum',
        value: '_customer',
        metadata: null,
        definition: {
            options: 'account_type_dom'
        }
    };
}

describe('EnumDetailFieldComponent', () => {
    let testHostComponent: EnumDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<EnumDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EnumDetailFieldTestHostComponent,
                EnumDetailFieldComponent,
            ],
            imports: [],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(EnumDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain('Customer');
        expect(testHostFixture.nativeElement.textContent).not.toContain('_customer');
    });
});
