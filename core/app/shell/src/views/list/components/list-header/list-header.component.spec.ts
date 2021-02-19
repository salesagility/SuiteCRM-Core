/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {take} from 'rxjs/operators';
import {of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';

import {ListHeaderComponent} from './list-header.component';
import {ModuleTitleModule} from '@components/module-title/module-title.module';
import {ActionMenuModule} from '@views/list/components/action-menu/action-menu.module';
import {SettingsMenuModule} from '@views/list/components/settings-menu/settings-menu.module';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesStore} from 'core';

import {themeImagesMockData} from 'core';
import {LanguageStore} from 'core';
import {languageStoreMock} from 'core';
import {NavigationStore} from 'core';
import {navigationMock} from 'core';
import {RouterTestingModule} from '@angular/router/testing';
import {ButtonModule} from '@components/button/button.module';
import {ListFilterModule} from '@components/list-filter/list-filter.module';
import {ListViewStore} from '@views/list/store/list-view/list-view.store';
import {listviewStoreMock} from '@views/list/store/list-view/list-view.store.spec.mock';
import {ModuleNavigation} from 'core';
import {mockModuleNavigation} from 'core';
import {SystemConfigStore} from 'core';
import {systemConfigStoreMock} from 'core';
import {UserPreferenceStore} from 'core';
import {userPreferenceStoreMock} from 'core';
import {MetadataStore} from 'core';
import {metadataStoreMock} from 'core';
import {AppStateStore} from 'core';
import {appStateStoreMock} from 'core';
import {AngularSvgIconModule} from 'angular-svg-icon';

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
                RouterTestingModule,
                AngularSvgIconModule.forRoot()
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
