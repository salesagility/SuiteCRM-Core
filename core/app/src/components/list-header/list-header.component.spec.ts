import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {take} from 'rxjs/operators';
import {of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';

import {ListHeaderComponent} from './list-header.component';
import {ModuleTitleModule} from '@components/module-title/module-title.module';
import {ActionMenuModule} from '@components/action-menu/action-menu.module';
import {SettingsmenuUiModule} from '@components/settings-menu/settings-menu.module';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';

import {themeImagesMockData} from '@base/facades/theme-images/theme-images.facade.spec.mock';
import {LanguageFacade} from '@store/language/language.facade';
import {languageMockData} from '@store/language/language.facade.spec.mock';
import {NavigationFacade} from '@store/navigation/navigation.facade';
import {navigationMockData} from '@store/navigation/navigation.facade.spec.mock';
import {RouterTestingModule} from '@angular/router/testing';
import {ButtonModule} from '@components/button/button.module';

@Component({
    selector: 'list-header-test-host-component',
    template: '<scrm-list-header [module]="module"></scrm-list-header>'
})
class ListHeaderTestHostComponent {
    module = 'accounts';
}

describe('ListHeaderComponent', () => {
    let testHostComponent: ListHeaderTestHostComponent;
    let testHostFixture: ComponentFixture<ListHeaderTestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ModuleTitleModule,
                ActionMenuModule,
                ButtonModule,
                SettingsmenuUiModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                ImageModule,
                RouterTestingModule
            ],
            declarations: [ListHeaderComponent, ListHeaderTestHostComponent],
            providers: [
                {
                    provide: ThemeImagesFacade, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
                {
                    provide: LanguageFacade, useValue: {
                        vm$: of(languageMockData).pipe(take(1)),
                        appListStrings$: of(languageMockData.appListStrings).pipe(take(1))
                    }
                },
                {
                    provide: NavigationFacade, useValue: {
                        vm$: of(navigationMockData.navbar).pipe(take(1))
                    }
                },
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(ListHeaderTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have action menu', () => {

        const actionMenuElement = testHostFixture.nativeElement.querySelector('scrm-action-menu');
        const actionButtons = actionMenuElement.getElementsByClassName('action-button');

        expect(testHostComponent).toBeTruthy();
        expect(actionMenuElement).toBeTruthy();
        expect(actionButtons).toBeTruthy();
        expect(actionButtons.length).toBeGreaterThan(0);
    });

    it('should have title', () => {

        const titleElement = testHostFixture.nativeElement.querySelector('scrm-module-title');

        expect(testHostComponent).toBeTruthy();
        expect(titleElement).toBeTruthy();
        expect(titleElement.innerHTML).toContain('ACCOUNTS');
    });

    it('should have settings', () => {
        const settingsMenuElement = testHostFixture.nativeElement.querySelector('scrm-settings-menu-ui');
        const settingsButtons = settingsMenuElement.getElementsByClassName('settings-button');

        expect(testHostComponent).toBeTruthy();
        expect(settingsMenuElement).toBeTruthy();
        expect(settingsButtons).toBeTruthy();
        expect(settingsButtons.length).toBeGreaterThan(0);
    });
});
