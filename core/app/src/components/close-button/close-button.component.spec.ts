import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {CloseButtonComponent} from './close-button.component';
import {ButtonInterface} from '@components/button/button.model';
import {ButtonModule} from '@components/button/button.module';

@Component({
    selector: 'close-button-test-host-component',
    template: '<scrm-close-button [config]="button"></scrm-close-button>'
})
class CloseButtonTestHostComponent {
    clicked = 0;
    button: ButtonInterface = {
        klass: {'some-class': true},
        onClick: () => {
            this.clicked++;
        }
    };
}

describe('CloseButtonComponent', () => {
    let testHostComponent: CloseButtonTestHostComponent;
    let testHostFixture: ComponentFixture<CloseButtonTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CloseButtonTestHostComponent,
                CloseButtonComponent,
            ],
            imports: [
                ButtonModule
            ],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(CloseButtonTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have close icon', () => {
        expect(testHostComponent).toBeTruthy();
        const button = testHostFixture.nativeElement.querySelector('button');
        const span = testHostFixture.nativeElement.querySelector('span');

        expect(button).toBeTruthy();
        expect(span).toBeTruthy();
        expect(span.textContent).toContain('×');
    });

    it('should have class', () => {
        expect(testHostComponent).toBeTruthy();
        const button = testHostFixture.nativeElement.querySelector('button');

        expect(button).toBeTruthy();
        expect(button.className).toContain('some-class');
        expect(button.className).toContain('close-button');
    });

    it('should be clickable', async(() => {
        expect(testHostComponent).toBeTruthy();
        const button = testHostFixture.nativeElement.querySelector('button');

        testHostComponent.clicked = 0;

        expect(button).toBeTruthy();

        button.click();
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(testHostComponent.clicked).toEqual(1);
        });
    }));

});
