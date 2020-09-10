import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {TextDetailFieldComponent} from './text.component';
import {Field} from '@app-common/record/field.model';

@Component({
    selector: 'text-detail-field-test-host-component',
    template: '<scrm-text-detail [field]="field"></scrm-text-detail>'
})
class TextDetailFieldTestHostComponent {
    field: Field = {
        type: 'text',
        value: 'My Text',
        metadata: null
    };
}

describe('TextDetailFieldComponent', () => {
    let testHostComponent: TextDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<TextDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TextDetailFieldTestHostComponent,
                TextDetailFieldComponent,
            ],
            imports: [],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(TextDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain('My Text');
    });

    it('should have default rows 6', () => {
        const el = testHostFixture.nativeElement.querySelector('textarea');

        expect(testHostComponent).toBeTruthy();
        expect(el).toBeTruthy();
        expect(el.rows).toEqual(6);
    });

    it('should have default cols 50', () => {
        const el = testHostFixture.nativeElement.querySelector('textarea');

        expect(testHostComponent).toBeTruthy();
        expect(el).toBeTruthy();
        expect(el.cols).toEqual(50);
    });
});
