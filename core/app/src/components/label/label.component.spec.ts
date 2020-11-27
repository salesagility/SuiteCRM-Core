import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LabelComponent} from './label.component';
import {Component} from '@angular/core';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {LabelModule} from '@components/label/label.module';


@Component({
    selector: 'label-host-component',
    template: '<scrm-label [labelKey]="label" [listKey]="listKey" [module]="module"></scrm-label>'
})
class LabelTestHostComponent {
    label = 'LBL_NO_DATA';
    listKey = null;
    module = null;
}


describe('LabelComponent', () => {
    let component: LabelTestHostComponent;
    let fixture: ComponentFixture<LabelTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LabelComponent, LabelTestHostComponent],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
            ],
            imports: [LabelModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LabelTestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have appStrings label', () => {
        expect(component).toBeTruthy();

        component.label = 'LBL_NO_DATA';
        component.listKey = null;

        fixture.detectChanges();
        fixture.whenRenderingDone().then(() => {
            expect(fixture.nativeElement.textContent).toContain('No Data');
        });
    });

    it('should have appListStrings label', () => {
        expect(component).toBeTruthy();

        component.label = '_analyst';
        component.listKey = 'account_type_dom';

        fixture.detectChanges();
        fixture.whenRenderingDone().then(() => {
            expect(fixture.nativeElement.textContent).toContain('Analyst');
        });
    });

    it('should have mod strings label', () => {
        expect(component).toBeTruthy();

        component.label = 'LBL_MODULE_NAME';
        component.listKey = null;
        component.module = 'accounts';

        fixture.detectChanges();
        fixture.whenRenderingDone().then(() => {
            expect(fixture.nativeElement.textContent).toContain('Accounts');
        });
    });
});
