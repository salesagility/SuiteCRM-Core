import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ButtonGroupComponent} from './button-group.component';
import {Component} from '@angular/core';
import {ButtonModule} from '@components/button/button.module';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {ButtonGroupInterface} from '@app-common/components/button/button-group.model';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {shareReplay} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';

@Component({
    selector: 'dropdown-group-test-host-component',
    template: '<scrm-button-group [config$]="config"></scrm-button-group>'
})
class ButtonGroupTestHostComponent {
    clicked = 0;
    clickedItem1 = 0;
    clickedItem2 = 0;
    clickedItem3 = 0;
    clickedItem4 = 0;
    clickedItem5 = 0;
    clickedItem6 = 0;
    config: Observable<ButtonGroupInterface> = of({
        wrapperKlass: ['some-class'],
        dropdownLabel: 'Test Dropdown Label',
        buttons: [
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
            },
            {
                label: 'Item 3',
                onClick: (): void => {
                    this.clickedItem3++;
                }
            },
            {
                label: 'Item 4',
                onClick: (): void => {
                    this.clickedItem4++;
                }
            },
            {
                label: 'Item 5',
                onClick: (): void => {
                    this.clickedItem5++;
                }
            },
            {
                label: 'Item 6',
                onClick: (): void => {
                    this.clickedItem6++;
                }
            },
        ]
    }).pipe(shareReplay(1));
}

describe('ButtonGroupComponent', () => {

    let testHostComponent: ButtonGroupTestHostComponent;
    let testHostFixture: ComponentFixture<ButtonGroupTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ButtonGroupTestHostComponent,
                ButtonGroupComponent,
            ],
            imports: [
                ButtonModule,
                NgbDropdownModule,
                DropdownButtonModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock}
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(ButtonGroupTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('buttons should be clickable', waitForAsync(() => {
        expect(testHostComponent).toBeTruthy();
        const buttons = testHostFixture.nativeElement.getElementsByClassName('button-group-button');

        expect(buttons).toBeTruthy();
        expect(buttons.length).toEqual(5);

        buttons.item(0).click();
        buttons.item(1).click();
        buttons.item(2).click();
        buttons.item(3).click();

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            expect(testHostComponent.clickedItem1).toEqual(1);
            expect(testHostComponent.clickedItem2).toEqual(1);
            expect(testHostComponent.clickedItem3).toEqual(1);
            expect(testHostComponent.clickedItem4).toEqual(1);
        });
    }));

    it('dropdown items should be clickable', waitForAsync(() => {
        expect(testHostComponent).toBeTruthy();

        const element = testHostFixture.nativeElement;
        const buttonWrapper = element.getElementsByClassName('button-group-dropdown').item(0);
        const button = buttonWrapper.getElementsByClassName('dropdown-toggle button-group-button').item(0);
        const divElement = element.querySelector('scrm-dropdown-button');

        testHostComponent.clicked = 0;

        expect(button).toBeTruthy();

        button.click();
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            const links = divElement.getElementsByClassName('dropdown-item');

            expect(links.length).toEqual(2);
            links.item(0).click();
            links.item(1).click();

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {
                expect(testHostComponent.clickedItem5).toEqual(1);
                expect(testHostComponent.clickedItem6).toEqual(1);
            });
        });
    }));
});
