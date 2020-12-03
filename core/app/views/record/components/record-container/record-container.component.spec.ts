import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {RecordContainerComponent} from './record-container.component';
import {WidgetPanelModule} from '@components/widget-panel/widget-panel.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RecordViewStore} from '@views/record/store/record-view/record-view.store';
import {recordviewStoreMock} from '@views/record/store/record-view/record-view.store.spec.mock';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {take} from 'rxjs/operators';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {
    mockModuleNavigation,
    mockRouter
} from '@services/navigation/module-navigation/module-navigation.service.spec.mock';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {systemConfigStoreMock} from '@store/system-config/system-config.store.spec.mock';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NavigationStore} from '@store/navigation/navigation.store';
import {navigationMock} from '@store/navigation/navigation.store.spec.mock';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {metadataStoreMock} from '@store/metadata/metadata.store.spec.mock';
import {AppStateStore} from '@store/app-state/app-state.store';
import {appStateStoreMock} from '@store/app-state/app-state.store.spec.mock';
import {Router} from '@angular/router';
import {SubpanelModule} from '@containers/subpanel/components/subpanel/subpanel.module';

describe('RecordContainerComponent', () => {
    let component: RecordContainerComponent;
    let fixture: ComponentFixture<RecordContainerComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                WidgetPanelModule,
                AngularSvgIconModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
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
