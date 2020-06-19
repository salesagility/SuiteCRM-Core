import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {ActionMenuComponent} from './action-menu.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ButtonModule} from '@components/button/button.module';
import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {mockModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service.spec.mock';

@Component({
    selector: 'action-menu-test-host-component',
    template: '<scrm-action-menu></scrm-action-menu>'
})
class ActionMenuTestHostComponent {
}

describe('ActionMenuComponent', () => {
    let testHostComponent: ActionMenuTestHostComponent;
    let testHostFixture: ComponentFixture<ActionMenuTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ActionMenuComponent,
                ActionMenuTestHostComponent,
            ],
            imports: [
                RouterTestingModule,
                ButtonModule
            ],
            providers: [
                {provide: ListViewStore, useValue: listviewStoreMock},
                {
                    provide: ModuleNavigation, useValue: mockModuleNavigation
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(ActionMenuTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should render', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have list', () => {
        expect(testHostComponent).toBeTruthy();

        const divElement = testHostFixture.nativeElement.querySelector('div');

        expect(divElement.className).toContain('list-view-actions');

    });

    it('should have action buttons', () => {
        const divElement = testHostFixture.nativeElement.querySelector('div');
        const actionButtons = divElement.getElementsByClassName('action-button');

        const createButton = actionButtons.item(0);
        const listButton = actionButtons.item(1);
        const importButton = actionButtons.item(2);

        expect(testHostComponent).toBeTruthy();
        expect(divElement).toBeTruthy();
        expect(actionButtons).toBeTruthy();
        expect(actionButtons.length).toEqual(3);

        expect(createButton.textContent).toContain('Create Account');
        expect(listButton.textContent).toContain('View Accounts');
        expect(importButton.textContent).toContain('Import Accounts');
    });
});
