import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {MinimiseButtonComponent} from './minimise-button.component';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {ButtonModule} from '@components/button/button.module';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesStoreMock} from '@store/theme-images/theme-images.store.spec.mock';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';

@Component({
    selector: 'minimise-button-test-host-component',
    template: '<scrm-minimise-button [config]="button"></scrm-minimise-button>'
})
class MinimiseButtonTestHostComponent {
    clicked = 0;
    button: ButtonInterface = {
        klass: {'some-class': true},
        onClick: () => {
            this.clicked++;
        }
    };
}

describe('MinimiseButtonComponent', () => {
    let testHostComponent: MinimiseButtonTestHostComponent;
    let testHostFixture: ComponentFixture<MinimiseButtonTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MinimiseButtonTestHostComponent,
                MinimiseButtonComponent,
            ],
            imports: [
                ButtonModule
            ],
            providers: [
                {
                    provide: ThemeImagesStore, useValue: themeImagesStoreMock
                },
                {provide: LanguageStore, useValue: languageStoreMock}
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(MinimiseButtonTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have minimise icon', () => {
        expect(testHostComponent).toBeTruthy();
        const button = testHostFixture.nativeElement.querySelector('button');
        const svg = testHostFixture.nativeElement.querySelector('scrm-image');

        expect(button).toBeTruthy();
        expect(svg).toBeTruthy();
        expect(svg.attributes['ng-reflect-image'] && svg.attributes['ng-reflect-image'].value).toBeTruthy();
        expect(svg.attributes['ng-reflect-image'].value).toEqual('minimise');
    });

    it('should have class', () => {
        expect(testHostComponent).toBeTruthy();
        const button = testHostFixture.nativeElement.querySelector('button');

        expect(button).toBeTruthy();
        expect(button.className).toContain('some-class');
        expect(button.className).toContain('minimise-button');
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
            const svg = testHostFixture.nativeElement.querySelector('scrm-image');

            expect(svg.attributes['ng-reflect-image'] && svg.attributes['ng-reflect-image'].value).toBeTruthy();
            expect(svg.attributes['ng-reflect-image'].value).toEqual('plus_thin');
        });
    }));

    it('should toggle icon', async(() => {
        expect(testHostComponent).toBeTruthy();
        const button = testHostFixture.nativeElement.querySelector('button');

        testHostComponent.clicked = 0;

        expect(button).toBeTruthy();

        button.click();
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            expect(testHostComponent.clicked).toEqual(1);
            let svg = testHostFixture.nativeElement.querySelector('scrm-image');

            expect(svg.attributes['ng-reflect-image'] && svg.attributes['ng-reflect-image'].value).toBeTruthy();
            expect(svg.attributes['ng-reflect-image'].value).toEqual('plus_thin');

            button.click();
            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {

                expect(testHostComponent.clicked).toEqual(2);
                svg = testHostFixture.nativeElement.querySelector('scrm-image');

                expect(svg.attributes['ng-reflect-image'] && svg.attributes['ng-reflect-image'].value).toBeTruthy();
                expect(svg.attributes['ng-reflect-image'].value).toEqual('minimise');

            });

        });
    }));

});
