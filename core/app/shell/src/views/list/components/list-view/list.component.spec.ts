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

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ListComponent} from './list.component';
import {ListHeaderModule} from '@views/list/components/list-header/list-header.module';
import {ListContainerModule} from '@views/list/components/list-container/list-container.module';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesStore} from 'core';
import {themeImagesStoreMock} from 'core';
import {AppStateStore} from 'core';
import {LanguageStore} from 'core';
import {languageStoreMock} from 'core';
import {NavigationStore} from 'core';
import {navigationMock} from 'core';
import {DynamicModule} from 'ng-dynamic-component';
import {FieldModule} from '@fields/field.module';
import {By} from '@angular/platform-browser';
import {SystemConfigStore} from 'core';
import {ListViewStore} from '@views/list/store/list-view/list-view.store';
import {listviewStoreMock} from '@views/list/store/list-view/list-view.store.spec.mock';
import {systemConfigStoreMock} from 'core';
import {UserPreferenceStore} from 'core';
import {userPreferenceStoreMock} from 'core';
import {MetadataStore} from 'core';
import {metadataStoreMock} from 'core';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {appStateStoreMock} from 'core';
import {mockModuleNavigation} from 'core';
import {ModuleNavigation} from 'core';
import {SortButtonModule} from '@components/sort-button/sort-button.module';
import {RecordListStoreFactory} from 'core';
import {listStoreFactoryMock} from 'core';

@Component({
    selector: 'list-test-host-component',
    template: '<scrm-list></scrm-list>'
})
class ListTestHostComponent {
}

describe('ListComponent', () => {
    let testHostComponent: ListTestHostComponent;
    let testHostFixture: ComponentFixture<ListTestHostComponent>;

    beforeEach(waitForAsync(() => {
        /* eslint-disable camelcase, @typescript-eslint/camelcase */
        TestBed.configureTestingModule({
            imports: [
                ListHeaderModule,
                ListContainerModule,
                HttpClientTestingModule,
                RouterTestingModule,
                NoopAnimationsModule,
                ImageModule,
                ApolloTestingModule,
                DynamicModule,
                FieldModule,
                DropdownButtonModule,
                DropdownButtonModule,
                RouterTestingModule,
                SortButtonModule
            ],
            declarations: [ListComponent, ListTestHostComponent],
            providers: [
                {provide: RecordListStoreFactory, useValue: listStoreFactoryMock},
                {provide: ListViewStore, useValue: listviewStoreMock},
                {provide: ThemeImagesStore, useValue: themeImagesStoreMock},
                {provide: SystemConfigStore, useValue: systemConfigStoreMock},
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
                {provide: NavigationStore, useValue: navigationMock},
                {provide: ModuleNavigation, useValue: mockModuleNavigation},
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: MetadataStore, useValue: metadataStoreMock},
                {provide: AppStateStore, useValue: appStateStoreMock},
            ],
        })
            .compileComponents();
        /* eslint-enable camelcase, @typescript-eslint/camelcase */

        testHostFixture = TestBed.createComponent(ListTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));


    it('should create', waitForAsync(() => {
        expect(testHostComponent).toBeTruthy();
    }));

    it('should have list header', waitForAsync(() => {

        const headerElement = testHostFixture.nativeElement.querySelector('scrm-list-header');

        expect(testHostComponent).toBeTruthy();
        expect(headerElement).toBeTruthy();
    }));

    it('should have list container', waitForAsync(() => {
        const listContainerElement = testHostFixture.nativeElement.querySelector('scrm-list-container');

        expect(testHostComponent).toBeTruthy();
        expect(listContainerElement).toBeTruthy();
    }));

    it('should have title', waitForAsync(() => {
        const element = testHostFixture.debugElement.query(By.css('.list-view-title')).nativeElement;

        expect(testHostFixture).toBeTruthy();
        expect(element).toBeTruthy();
        expect(element.textContent).toContain('ACCOUNTS');
    }));
});
