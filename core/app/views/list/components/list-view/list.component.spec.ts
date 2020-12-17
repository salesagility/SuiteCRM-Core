import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ListComponent} from './list.component';
import {ListHeaderModule} from '@views/list/components/list-header/list-header.module';
import {ListContainerModule} from '@views/list/components/list-container/list-container.module';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesStoreMock} from '@store/theme-images/theme-images.store.spec.mock';
import {AppStateStore} from '@store/app-state/app-state.store';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {NavigationStore} from '@store/navigation/navigation.store';
import {navigationMock} from '@store/navigation/navigation.store.spec.mock';
import {DynamicModule} from 'ng-dynamic-component';
import {FieldModule} from '@fields/field.module';
import {By} from '@angular/platform-browser';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {ListViewStore} from '@views/list/store/list-view/list-view.store';
import {listviewStoreMock} from '@views/list/store/list-view/list-view.store.spec.mock';
import {systemConfigStoreMock} from '@store/system-config/system-config.store.spec.mock';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {metadataStoreMock} from '@store/metadata/metadata.store.spec.mock';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {appStateStoreMock} from '@store/app-state/app-state.store.spec.mock';
import {mockModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service.spec.mock';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {SortButtonModule} from '@components/sort-button/sort-button.module';
import {RecordListStoreFactory} from '@store/record-list/record-list.store.factory';
import {listStoreFactoryMock} from '@store/record-list/record-list.store.spec.mock';

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
                ListContainerModule,
                HttpClientTestingModule,
                RouterTestingModule,
                BrowserAnimationsModule,
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


    it('should create', async(() => {
        expect(testHostComponent).toBeTruthy();
    }));

    it('should have list header', async(() => {

        const headerElement = testHostFixture.nativeElement.querySelector('scrm-list-header');

        expect(testHostComponent).toBeTruthy();
        expect(headerElement).toBeTruthy();
    }));

    it('should have list container', async(() => {
        const listContainerElement = testHostFixture.nativeElement.querySelector('scrm-list-container');

        expect(testHostComponent).toBeTruthy();
        expect(listContainerElement).toBeTruthy();
    }));

    it('should have title', async(() => {
        const element = testHostFixture.debugElement.query(By.css('.list-view-title')).nativeElement;

        expect(testHostFixture).toBeTruthy();
        expect(element).toBeTruthy();
        expect(element.textContent).toContain('ACCOUNTS');
    }));
});
