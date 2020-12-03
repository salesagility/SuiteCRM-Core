import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ButtonComponent} from './button.component';
import {Component} from '@angular/core';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {ImageModule} from '@components/image/image.module';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';


@Component({
    selector: 'button-test-host-component',
    template: '<scrm-button [config]="config"></scrm-button>'
})
class ButtonTestHostComponent {
    clicked = 0;
    config: ButtonInterface = {
        klass: 'button-test',
        onClick: () => {
            this.clicked++;
        },
        label: 'Button label'
    };
}

describe('ButtonComponent', () => {
    let testHostComponent: ButtonTestHostComponent;
    let testHostFixture: ComponentFixture<ButtonTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ButtonComponent,
                ButtonTestHostComponent,
            ],
            imports: [
                ImageModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock}
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(ButtonTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should render', () => {
        expect(testHostComponent).toBeTruthy();
    });


    it('should have label', () => {

        const buttonElement = testHostFixture.nativeElement.querySelector('button');

        expect(testHostComponent).toBeTruthy();
        expect(buttonElement).toBeTruthy();
        expect(buttonElement.textContent).toContain('Button label');
    });

    it('should have class', () => {

        const buttonElement = testHostFixture.nativeElement.querySelector('button');

        expect(testHostComponent).toBeTruthy();
        expect(buttonElement).toBeTruthy();
        expect(buttonElement.className).toContain('button-test');
    });

    it('should support click', () => {

        const buttonElement = testHostFixture.nativeElement.querySelector('button');
        buttonElement.click();

        expect(testHostComponent).toBeTruthy();
        expect(buttonElement).toBeTruthy();
        expect(testHostComponent.clicked).toEqual(1);
    });

    it('should support no label', () => {

        const buttonElement = testHostFixture.nativeElement.querySelector('button');
        testHostComponent.config.label = null;

        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
        expect(buttonElement).toBeTruthy();
        expect(buttonElement.textContent).not.toContain('Button label');
    });

    it('should support no class', () => {

        const buttonElement = testHostFixture.nativeElement.querySelector('button');
        testHostComponent.config.klass = null;

        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
        expect(buttonElement).toBeTruthy();
        expect(buttonElement.className).not.toContain('button-class');
    });

    it('should support no click callback', () => {

        const buttonElement = testHostFixture.nativeElement.querySelector('button');

        testHostComponent.config.onClick = null;
        testHostFixture.detectChanges();

        buttonElement.click();

        expect(testHostComponent).toBeTruthy();
        expect(buttonElement).toBeTruthy();
        expect(testHostComponent.clicked).toEqual(0);
    });
});
