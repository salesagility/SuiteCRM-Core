import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModuleTitleComponent} from './module-title.component';
import {Component} from '@angular/core';

@Component({
    selector: 'module-title-test-host-component',
    template: '<scrm-module-title [title]="title"></scrm-module-title>'
})
class ModuleTitleTestHostComponent {
    title = 'Accounts';
}

describe('ModuleTitleComponent', () => {
    let testHostComponent: ModuleTitleTestHostComponent;
    let testHostFixture: ComponentFixture<ModuleTitleTestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ModuleTitleComponent,
                ModuleTitleTestHostComponent,
            ],
            imports: [],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(ModuleTitleTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have title', () => {

        expect(testHostFixture.nativeElement.textContent).toContain('ACCOUNTS');
    });
});
