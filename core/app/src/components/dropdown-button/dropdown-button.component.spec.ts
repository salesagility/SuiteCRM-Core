import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DropdownButtonComponent} from './dropdown-button.component';
import {Component} from '@angular/core';
import {ButtonModule} from '@components/button/button.module';
import {DropdownButtonInterface} from '@app-common/components/button/dropdown-button.model';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';

@Component({
    selector: 'dropdown-button-test-host-component',
    template: '<scrm-dropdown-button [config]="button"></scrm-dropdown-button>'
})
class DropdownButtonTestHostComponent {
    clicked = 0;
    clickedItem1 = 0;
    clickedItem2 = 0;
    button: DropdownButtonInterface = {
        klass: {'some-class': true},
        onClick: () => {
            this.clicked++;
        },
        label: 'Test Label',
        items: [
            {
                label: 'Item 1',
                onClick: (): void => {
                    this.clickedItem1++;
                }
            },
            {
                label: 'Item 2',
                onClick: (): void => {
                    this.clickedItem2++;
                }
            }
        ]
    };
}

describe('DropdownButtonComponent', () => {
    let testHostComponent: DropdownButtonTestHostComponent;
    let testHostFixture: ComponentFixture<DropdownButtonTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DropdownButtonTestHostComponent,
                DropdownButtonComponent,
            ],
            imports: [
                ButtonModule,
                NgbDropdownModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock}
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(DropdownButtonTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have class', () => {
        expect(testHostComponent).toBeTruthy();
        const button = testHostFixture.nativeElement.querySelector('button');

        expect(button).toBeTruthy();
        expect(button.className).toContain('some-class');
    });

    it('should be clickable', async(() => {
        expect(testHostComponent).toBeTruthy();
        const button = testHostFixture.nativeElement.querySelector('button');
        const divElement = testHostFixture.nativeElement.querySelector('div');

        testHostComponent.clicked = 0;

        expect(button).toBeTruthy();

        button.click();
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            const links = divElement.getElementsByClassName('dropdown-item');
            links.item(0).click();
            links.item(1).click();

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {
                expect(testHostComponent.clickedItem1).toEqual(1);
                expect(testHostComponent.clickedItem2).toEqual(1);
            });
        });
    }));

});
