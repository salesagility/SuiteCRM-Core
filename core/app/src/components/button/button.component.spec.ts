import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonComponent} from './button.component';
import {Component} from '@angular/core';
import {ButtonInterface} from '@components/button/button.model';
import {ImageModule} from '@components/image/image.module';


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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ButtonComponent,
                ButtonTestHostComponent,
            ],
            imports: [
                ImageModule
            ],
            providers: [],
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
