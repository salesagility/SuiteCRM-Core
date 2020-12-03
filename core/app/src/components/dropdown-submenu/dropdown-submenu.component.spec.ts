import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DropdownSubmenuComponent} from './dropdown-submenu.component';
import {Component} from '@angular/core';
import {ButtonModule} from '@components/button/button.module';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {DropdownButtonInterface} from '@app-common/components/button/dropdown-button.model';


@Component({
    selector: 'dropdown-submenu-test-host-component',
    template: '<scrm-dropdown-submenu [item]="config"></scrm-dropdown-submenu>'
})
class DropdownSubmenuTestHostComponent {
    clicked = 0;
    clickedItem1 = 0;
    clickedItem2 = 0;
    clickedItem3 = 0;
    clickedItem4 = 0;
    config: DropdownButtonInterface = {
        wrapperKlass: ['some-class'],
        label: 'Parent item',
        onClick: (): void => {
            this.clicked++;
        },
        items: [
            {
                label: 'Item 1',
                onClick: (): void => {
                    this.clickedItem1++;
                },
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
        ]
    };
}

describe('DropdownSubmenuComponent', () => {

    let testHostComponent: DropdownSubmenuTestHostComponent;
    let testHostFixture: ComponentFixture<DropdownSubmenuTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                DropdownSubmenuTestHostComponent,
                DropdownSubmenuComponent,
            ],
            imports: [
                ButtonModule,
                NgbDropdownModule,
                DropdownButtonModule
            ],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(DropdownSubmenuTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('dropdown items should be clickable', waitForAsync(() => {
        expect(testHostComponent).toBeTruthy();

        const element = testHostFixture.nativeElement;
        const button = element.getElementsByClassName('dropdown-submenu-parent-button').item(0);
        const subMenu = element.getElementsByClassName('dropdown-submenu').item(0);

        testHostComponent.clicked = 0;

        expect(button).toBeTruthy();

        button.click();
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            const links = subMenu.getElementsByClassName('dropdown-submenu-item-link');

            links.item(0).click();
            links.item(1).click();
            links.item(2).click();
            links.item(3).click();

            expect(links.length).toEqual(4);

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {
                expect(testHostComponent.clickedItem1).toEqual(1);
                expect(testHostComponent.clickedItem2).toEqual(1);
                expect(testHostComponent.clickedItem3).toEqual(1);
                expect(testHostComponent.clickedItem4).toEqual(1);
            });
        });
    }));
});
