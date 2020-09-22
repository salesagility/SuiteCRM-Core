import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RecordSettingsMenuComponent} from './record-settings-menu.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {take} from 'rxjs/operators';
import {ImageModule} from '@components/image/image.module';
import {ButtonModule} from '@components/button/button.module';
import {RecordViewStore} from '@store/record-view/record-view.store';
import {recordviewStoreMock} from '@store/record-view/record-view.store.spec.mock';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {mockModuleNavigation,} from '@services/navigation/module-navigation/module-navigation.service.spec.mock';
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
import {Component} from '@angular/core';
import {RecordSettingsMenuModule} from '@components/record-settings-menu/record-settings-menu.module';
import {RouterTestingModule} from '@angular/router/testing';
import {RecordActionsAdapter} from '@store/record-view/adapters/actions.adapter';
import {recordActionsMock} from '@store/record-view/adapters/actions.adapter.spec.mock';

@Component({
    selector: 'record-setting-test-host-component',
    template: '<scrm-record-settings-menu></scrm-record-settings-menu>'
})
class RecordSettingsTestHostComponent {
}

describe('RecordSettingsMenuComponent', () => {

    let testHostComponent: RecordSettingsTestHostComponent;
    let testHostFixture: ComponentFixture<RecordSettingsTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                ApolloTestingModule,
                ImageModule,
                ButtonModule,
                RecordSettingsMenuModule,
                RouterTestingModule
            ],
            declarations: [RecordSettingsMenuComponent, RecordSettingsTestHostComponent],
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
                {provide: RecordActionsAdapter, useValue: recordActionsMock},
            ],
        })
            .compileComponents();

        testHostFixture = TestBed.createComponent(RecordSettingsTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have buttons', () => {
        expect(testHostComponent).toBeTruthy();

        recordviewStoreMock.setMode('detail');

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const element = testHostFixture.nativeElement;
            const buttons = element.getElementsByClassName('settings-button');


            expect(buttons).toBeTruthy();
            expect(buttons.length).toEqual(3);
            expect(buttons.item(0).textContent).toContain('New');
            expect(buttons.item(1).textContent).toContain('Edit');
            expect(buttons.item(2).textContent).toContain('History');
        });
    });
});
