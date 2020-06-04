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
import {languageMockData} from '@store/language/language.store.spec.mock';
import {NavigationStore} from '@store/navigation/navigation.store';
import {navigationMockData} from '@store/navigation/navigation.store.spec.mock';
import {DynamicModule} from 'ng-dynamic-component';
import {FieldModule} from '@fields/field.module';
import {By} from '@angular/platform-browser';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';

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
                    }
                },
                {
                    provide: LanguageStore, useValue: {
                        vm$: of(languageMockData).pipe(take(1)),
                        appListStrings$: of(languageMockData.appListStrings).pipe(take(1))
                    }
                },
                {
                    provide: NavigationStore, useValue: {
                        vm$: of(navigationMockData.navbar).pipe(take(1))
                    }
                },
                {
                    provide: SystemConfigStore, useValue: {
                        configs$: of({
                            default_number_grouping_seperator: {
                                id: '/docroot/api/system-configs/default_number_grouping_seperator',
                                _id: 'default_number_grouping_seperator',
                                value: ';',
                                items: []
                            },
                            default_decimal_seperator: {
                                id: '/docroot/api/system-configs/default_decimal_seperator',
                                _id: 'default_decimal_seperator',
                                value: ',',
                                items: []
                            }
                        })
                    }
                }
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
