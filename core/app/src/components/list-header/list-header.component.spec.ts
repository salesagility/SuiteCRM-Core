import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {take} from 'rxjs/operators';
import {of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';

import {ListHeaderComponent} from './list-header.component';
import {ModuleTitleModule} from '@components/module-title/module-title.module';
import {ActionMenuModule} from '@components/action-menu/action-menu.module';
import {SettingsMenuModule} from '@components/settings-menu/settings-menu.module';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';

import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {NavigationStore} from '@store/navigation/navigation.store';
import {navigationMock} from '@store/navigation/navigation.store.spec.mock';
import {RouterTestingModule} from '@angular/router/testing';
import {ButtonModule} from '@components/button/button.module';
import {ListFilterModule} from '@components/list-filter/list-filter.module';
import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {mockModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service.spec.mock';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {systemConfigStoreMock} from '@store/system-config/system-config.store.spec.mock';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {metadataStoreMock} from '@store/metadata/metadata.store.spec.mock';
import {AppStateStore} from '@store/app-state/app-state.store';
import {appStateStoreMock} from '@store/app-state/app-state.store.spec.mock';

@Component({
    selector: 'list-header-test-host-component',
    template: '<scrm-list-header></scrm-list-header>'
})
class ListHeaderTestHostComponent {
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
                SettingsMenuModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                ImageModule,
                ListFilterModule,
                RouterTestingModule
            ],
            declarations: [ListHeaderComponent, ListHeaderTestHostComponent],
            providers: [
                {provide: ListViewStore, useValue: listviewStoreMock},
                {
                    provide: ThemeImagesStore, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
                {
                    provide: ModuleNavigation, useValue: mockModuleNavigation
                },
                {
                    provide: SystemConfigStore, useValue: systemConfigStoreMock
                },
                {
                    provide: UserPreferenceStore, useValue: userPreferenceStoreMock
                },
                {
                    provide: NavigationStore, useValue: navigationMock
                },
                {
                    provide: ModuleNavigation, useValue: mockModuleNavigation
                },
                {
                    provide: LanguageStore, useValue: languageStoreMock
                },
                {
                    provide: MetadataStore, useValue: metadataStoreMock
                },
                {
                    provide: AppStateStore, useValue: appStateStoreMock
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
        const settingsMenuElement = testHostFixture.nativeElement.querySelector('scrm-settings-menu');
        const settingsButtons = settingsMenuElement.getElementsByClassName('settings-button');

        expect(testHostComponent).toBeTruthy();
        expect(settingsMenuElement).toBeTruthy();
        expect(settingsButtons).toBeTruthy();
        expect(settingsButtons.length).toBeGreaterThan(0);
    });
});
