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
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {RecordHeaderComponent} from './record-header.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ButtonModule} from '../../../../components/button/button.module';
import {RecordViewStore} from '../../store/record-view/record-view.store';
import {SystemConfigStore} from '../../../../store/system-config/system-config.store';
import {UserPreferenceStore} from '../../../../store/user-preference/user-preference.store';
import {NavigationStore} from '../../../../store/navigation/navigation.store';
import {recordviewStoreMock} from '../../store/record-view/record-view.store.spec.mock';
import {ModuleNavigation} from '../../../../services/navigation/module-navigation/module-navigation.service';
import {userPreferenceStoreMock} from '../../../../store/user-preference/user-preference.store.spec.mock';
import {LanguageStore} from '../../../../store/language/language.store';
import {metadataStoreMock} from '../../../../store/metadata/metadata.store.spec.mock';
import {ImageModule} from '../../../../components/image/image.module';
import {ModuleTitleModule} from '../../../../components/module-title/module-title.module';
import {MetadataStore} from '../../../../store/metadata/metadata.store.service';
import {themeImagesStoreMock} from '../../../../store/theme-images/theme-images.store.spec.mock';
import {navigationMock} from '../../../../store/navigation/navigation.store.spec.mock';
import {AppStateStore} from '../../../../store/app-state/app-state.store';
import {mockModuleNavigation} from '../../../../services/navigation/module-navigation/module-navigation.service.spec.mock';
import {languageStoreMock} from '../../../../store/language/language.store.spec.mock';
import {RecordActionsAdapter} from '../../adapters/actions.adapter';
import {systemConfigStoreMock} from '../../../../store/system-config/system-config.store.spec.mock';
import {appStateStoreMock} from '../../../../store/app-state/app-state.store.spec.mock';
import {recordActionsMock} from '../../adapters/actions.adapter.spec.mock';
import {ThemeImagesStore} from '../../../../store/theme-images/theme-images.store';
import {ActionGroupMenuModule} from '../../../../components/action-group-menu/action-group-menu.module';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

@Component({
    selector: 'record-header-test-host-component',
    template: '<scrm-record-header></scrm-record-header>'
})
class RecordHeaderTestHostComponent {
}

describe('RecordHeaderComponent', () => {
    let testHostComponent: RecordHeaderTestHostComponent;
    let testHostFixture: ComponentFixture<RecordHeaderTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    declarations: [RecordHeaderComponent, RecordHeaderTestHostComponent],
    imports: [ModuleTitleModule,
        ButtonModule,
        ApolloTestingModule,
        ImageModule,
        RouterTestingModule,
        ActionGroupMenuModule],
    providers: [
        { provide: RecordViewStore, useValue: recordviewStoreMock },
        { provide: ThemeImagesStore, useValue: themeImagesStoreMock },
        { provide: ModuleNavigation, useValue: mockModuleNavigation },
        { provide: SystemConfigStore, useValue: systemConfigStoreMock },
        { provide: UserPreferenceStore, useValue: userPreferenceStoreMock },
        { provide: NavigationStore, useValue: navigationMock },
        { provide: ModuleNavigation, useValue: mockModuleNavigation },
        { provide: LanguageStore, useValue: languageStoreMock },
        { provide: MetadataStore, useValue: metadataStoreMock },
        { provide: AppStateStore, useValue: appStateStoreMock },
        { provide: RecordActionsAdapter, useValue: recordActionsMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
            .compileComponents();

        testHostFixture = TestBed.createComponent(RecordHeaderTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have detail buttons', waitForAsync(() => {
        expect(testHostComponent).toBeTruthy();

        recordviewStoreMock.setMode('detail');

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const element = testHostFixture.nativeElement;
            const buttons = element.getElementsByClassName('settings-button');


            expect(buttons).toBeTruthy();
            expect(buttons.length).toEqual(2);
            expect(buttons.item(0).textContent).toContain('New');
            expect(buttons.item(1).textContent).toContain('Edit');
        });
    }));

    it('should have edit buttons', waitForAsync(() => {
        expect(testHostComponent).toBeTruthy();

        recordviewStoreMock.setMode('edit');

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const element = testHostFixture.nativeElement;
            const buttons = element.getElementsByClassName('settings-button');


            expect(buttons).toBeTruthy();
            expect(buttons.length).toEqual(2);
            expect(buttons.item(0).textContent).toContain('Save');
            expect(buttons.item(1).textContent).toContain('Cancel');
        });
    }));
});
