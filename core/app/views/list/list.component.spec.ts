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
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {themeImagesMockData} from '@base/facades/theme-images/theme-images.facade.spec.mock';
import {AppStateFacade} from '@store/app-state/app-state.facade';
import {LanguageFacade} from '@store/language/language.facade';
import {languageMockData} from '@store/language/language.facade.spec.mock';
import {NavigationFacade} from '@store/navigation/navigation.facade';
import {navigationMockData} from '@store/navigation/navigation.facade.spec.mock';
import {DynamicModule} from "ng-dynamic-component";
import {FieldModule} from "../../fields/field.module";
import { By } from '@angular/platform-browser';

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
                    provide: ThemeImagesFacade, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    },
                },
                {
                    provide: AppStateFacade, useValue: {
                        vm$: of({
                            loading: false,
                            module: 'accounts',
                            view: 'list',
                            loaded: true
                        }).pipe(take(1))
                    }
                },
                {
                    provide: LanguageFacade, useValue: {
                        vm$: of(languageMockData).pipe(take(1)),
                        appListStrings$: of(languageMockData.appListStrings).pipe(take(1))
                    }
                },
                {
                    provide: NavigationFacade, useValue: {
                        vm$: of(navigationMockData.navbar).pipe(take(1))
                    }
                },
            ],
        })
            .compileComponents();
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

