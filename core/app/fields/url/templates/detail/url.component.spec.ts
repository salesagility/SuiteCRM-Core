import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {UrlDetailFieldComponent} from './url.component';
import {FieldMetadata} from '@fields/field.model';


@Component({
    selector: 'url-detail-field-test-host-component',
    template: '<scrm-url-detail [value]="value" [metadata]="metadata"></scrm-url-detail>'
})
class UrlDetailFieldTestHostComponent {
    value = 'https://community.suitecrm.com/';
    metadata: FieldMetadata = null;
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

        testHostFixture.componentInstance.metadata = {
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
