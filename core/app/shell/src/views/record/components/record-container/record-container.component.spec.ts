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
import {ApolloTestingModule} from 'apollo-angular/testing';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {RecordContainerComponent} from './record-container.component';
import {WidgetPanelModule} from '@components/widget-panel/widget-panel.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RecordViewStore} from '@views/record/store/record-view/record-view.store';
import {recordviewStoreMock} from '@views/record/store/record-view/record-view.store.spec.mock';
import {ThemeImagesStore} from 'core';
import {of} from 'rxjs';
import {themeImagesMockData} from 'core';
import {take} from 'rxjs/operators';
import {ModuleNavigation} from 'core';
import {
    mockModuleNavigation,
    mockRouter
} from 'core';
import {SystemConfigStore} from 'core';
import {systemConfigStoreMock} from 'core';
import {UserPreferenceStore} from 'core';
import {userPreferenceStoreMock} from 'core';
import {NavigationStore} from 'core';
import {navigationMock} from 'core';
import {LanguageStore} from 'core';
import {languageStoreMock} from 'core';
import {MetadataStore} from 'core';
import {metadataStoreMock} from 'core';
import {AppStateStore} from 'core';
import {appStateStoreMock} from 'core';
import {Router} from '@angular/router';
import {SubpanelModule} from '@containers/subpanel/components/subpanel/subpanel.module';

describe('RecordContainerComponent', () => {
    let component: RecordContainerComponent;
    let fixture: ComponentFixture<RecordContainerComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                WidgetPanelModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                NoopAnimationsModule,
                ApolloTestingModule,
                SubpanelModule
            ],
            providers: [
                {provide: RecordViewStore, useValue: recordviewStoreMock},
                {
                    provide: ThemeImagesStore, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
                {provide: ModuleNavigation, useValue: mockModuleNavigation},
                {provide: SystemConfigStore, useValue: systemConfigStoreMock},
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
                {provide: NavigationStore, useValue: navigationMock},
                {provide: ModuleNavigation, useValue: mockModuleNavigation},
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: MetadataStore, useValue: metadataStoreMock},
                {provide: AppStateStore, useValue: appStateStoreMock},
                {provide: Router, useValue: mockRouter},
            ],
            declarations: [RecordContainerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecordContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
