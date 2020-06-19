import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {take} from 'rxjs/operators';
import {of} from 'rxjs';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ListComponent} from './list.component';
import {ListHeaderModule} from '@components/list-header/list-header.module';
import {ListcontainerUiModule} from '@components/list-container/list-container.module';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {AppStateStore} from '@store/app-state/app-state.store';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {NavigationStore} from '@store/navigation/navigation.store';
import {navigationMock} from '@store/navigation/navigation.store.spec.mock';
import {DynamicModule} from 'ng-dynamic-component';
import {FieldModule} from '@fields/field.module';
import {By} from '@angular/platform-browser';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';
import {systemConfigStoreMock} from '@store/system-config/system-config.store.spec.mock';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {metadataStoreMock} from '@store/metadata/metadata.store.spec.mock';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {appStateStoreMock} from '@store/app-state/app-state.store.spec.mock';
import {mockModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service.spec.mock';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';

@Component({
    selector: 'list-test-host-component',
    template: '<scrm-list></scrm-list>'
})
class ListTestHostComponent {
}

describe('ListComponent', () => {
    let testHostComponent: ListTestHostComponent;
    let testHostFixture: ComponentFixture<ListTestHostComponent>;

    beforeEach(async(() => {
        /* eslint-disable camelcase, @typescript-eslint/camelcase */
        TestBed.configureTestingModule({
            imports: [
                ListHeaderModule,
                ListcontainerUiModule,
                HttpClientTestingModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                ImageModule,
                ApolloTestingModule,
                DynamicModule,
                FieldModule,
                DropdownButtonModule,
                DropdownButtonModule,
                RouterTestingModule
            ],
            declarations: [ListComponent, ListTestHostComponent],
            providers: [
                {
                    provide: ListViewStore, useValue: listviewStoreMock
                },
                {
                    provide: ThemeImagesStore, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    },
                },
                /*
                {
                    provide: AppStateStore, useValue: {
                        vm$: of({
                            loading: false,
                            module: 'accounts',
                            view: 'list',
                            loaded: true
                        }).pipe(take(1)),
                        getModule: (): string => 'accounts',
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        updateLoading: (key: string, loading: boolean): void => {
                        }
                    } as AppStateStore
                },
                {
                    provide: LanguageStore, useValue: {
                        vm$: of(languageMockData).pipe(take(1)),
                        appListStrings$: of(languageMockData.appListStrings).pipe(take(1)),
                        appStrings$: of(languageMockData.appStrings).pipe(take(1))
                    }
                },
                {
                    provide: NavigationStore, useValue: {
                        vm$: of(navigationMockData.navbar).pipe(take(1))
                    }
                },
                {
                    provide: MetadataStore, useValue: {
                        listMetadata$: of({
                            fields: metadataMockData.listView
                        }).pipe(take(1)),
                    }
                },
                */
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
        /* eslint-enable camelcase, @typescript-eslint/camelcase */
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(ListTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have list header', () => {

        const headerElement = testHostFixture.nativeElement.querySelector('scrm-list-header');

        expect(testHostComponent).toBeTruthy();
        expect(headerElement).toBeTruthy();
    });

    it('should have list container', () => {
        const listContainerElement = testHostFixture.nativeElement.querySelector('scrm-list-container-ui');

        expect(testHostComponent).toBeTruthy();
        expect(listContainerElement).toBeTruthy();
    });

    it('should have title', () => {
        const element = testHostFixture.debugElement.query(By.css('.ng-star-inserted')).nativeElement;

        expect(testHostFixture).toBeTruthy();
        expect(element).toBeTruthy();
        expect(element.textContent).toContain('MY FIELD VALUE');
    });
});
