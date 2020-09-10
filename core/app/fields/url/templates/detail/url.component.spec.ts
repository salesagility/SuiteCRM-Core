import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {UrlDetailFieldComponent} from './url.component';
import {Field, FieldMetadata} from '@app-common/record/field.model';

@Component({
    selector: 'url-detail-field-test-host-component',
    template: '<scrm-url-detail [field]="field"></scrm-url-detail>'
})
class UrlDetailFieldTestHostComponent {
    field: Field = {
        type: 'url',
        value: 'https://community.suitecrm.com/',
        metadata: null
    };
}

describe('UrlDetailFieldComponent', () => {
    let testHostComponent: UrlDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<UrlDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                UrlDetailFieldTestHostComponent,
                UrlDetailFieldComponent,
            ],
            imports: [],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(UrlDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        const el = testHostFixture.nativeElement.querySelector('a');

        expect(testHostComponent).toBeTruthy();
        expect(el).toBeTruthy();
    });

    it('should have value', () => {
        const el = testHostFixture.nativeElement.querySelector('a');

        expect(testHostComponent).toBeTruthy();
        expect(el).toBeTruthy();
        expect(el.text).toContain('https://community.suitecrm.com/');
    });

    it('should have href', () => {
        const el = testHostFixture.nativeElement.querySelector('a');

        expect(testHostComponent).toBeTruthy();
        expect(el).toBeTruthy();
        expect(el.href).toContain('https://community.suitecrm.com/');
    });

    it('should have default target _blank', () => {
        const el = testHostFixture.nativeElement.querySelector('a');

        expect(testHostComponent).toBeTruthy();
        expect(el).toBeTruthy();
        expect(el.target).toContain('_blank');
    });

    it('should use configured target', async(() => {

        testHostFixture.componentInstance.field.metadata = {
            target: '_self'
        } as FieldMetadata;
        testHostFixture.detectChanges();

        testHostFixture.whenStable().then(() => {
            const el = testHostFixture.nativeElement.querySelector('a');

            expect(testHostComponent).toBeTruthy();
            expect(el).toBeTruthy();
            expect(el.target).toContain('_self');
        });
    }));
});
