import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {ActionMenuComponent} from './action-menu.component';
import {LanguageStore} from '@store/language/language.store';
import {languageMockData} from '@store/language/language.store.spec.mock';
import {NavigationStore} from '@store/navigation/navigation.store';
import {navigationMockData} from '@store/navigation/navigation.store.spec.mock';
import {RouterTestingModule} from '@angular/router/testing';
import {ButtonModule} from '@components/button/button.module';

@Component({
    selector: 'action-menu-test-host-component',
    template: '<scrm-action-menu [module]="module"></scrm-action-menu>'
})
class ActionMenuTestHostComponent {
    module = 'accounts';
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
                {
                    provide: LanguageStore, useValue: {
                        vm$: of(languageMockData).pipe(take(1))
                    }
                },
                {
                    provide: NavigationStore, useValue: {
                        vm$: of(navigationMockData.navbar).pipe(take(1))
                    }
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

        const createButton = actionButtons.item(0)
        const listButton = actionButtons.item(1)
        const importButton = actionButtons.item(2)

        expect(testHostComponent).toBeTruthy();
        expect(divElement).toBeTruthy();
        expect(actionButtons).toBeTruthy();
        expect(actionButtons.length).toEqual(3);

        expect(createButton.textContent).toContain('Create Account');
        expect(listButton.textContent).toContain('View Accounts');
        expect(importButton.textContent).toContain('Import Accounts');
    });
});
