import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {RecordHeaderComponent} from './record-header.component';
import {ModuleTitleModule} from '@components/module-title/module-title.module';
import {ImageModule} from '@components/image/image.module';
import {RouterTestingModule} from '@angular/router/testing';
import {ButtonModule} from '@components/button/button.module';
import {recordviewStoreMock} from '@store/record-view/record-view.store.spec.mock';
import {RecordViewStore} from '@store/record-view/record-view.store';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {take} from 'rxjs/operators';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {mockModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service.spec.mock';
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
import {RecordSettingsMenuModule} from '@components/record-settings-menu/record-settings-menu.module';

@Component({
    selector: 'record-header-test-host-component',
    template: '<scrm-record-header></scrm-record-header>'
})
class RecordHeaderTestHostComponent {
}

describe('RecordHeaderComponent', () => {
    let testHostComponent: RecordHeaderTestHostComponent;
    let testHostFixture: ComponentFixture<RecordHeaderTestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ModuleTitleModule,
                ButtonModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                ImageModule,
                RouterTestingModule,
                RecordSettingsMenuModule
            ],
            declarations: [RecordHeaderComponent, RecordHeaderTestHostComponent],
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
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(RecordHeaderTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
