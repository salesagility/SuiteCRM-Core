import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MenuItemComponent} from './menu-item.component';
import {Component} from '@angular/core';
import {MenuItemLinkComponent} from '@components/navbar/menu-item-link/menu-item-link.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ImageModule} from '@components/image/image.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {take} from 'rxjs/operators';
import {LanguageStrings} from '@store/language/language.store';
import {languageMockData} from '@store/language/language.store.spec.mock';
import {MenuRecentlyViewedComponent} from '@components/navbar/menu-recently-viewed/menu-recently-viewed.component';
import {MenuItem} from '@app-common/menu/menu.model';

const mockMenuItem = {
    link: {
        url: '',
        label: 'Top Link Label',
        route: '/fake-module',
    },
    icon: '',
    submenu: [
        {
            link: {
                url: '',
                label: 'Sub Link 1',
                route: '/fake-module/edit',
            },
            icon: 'plus',
            submenu: []
        },
        {
            link: {
                url: '',
                label: 'Sub Link 2',
                route: '/fake-module/list',
            },
            icon: 'view',
            submenu: []
        }
    ],
    recentRecords: null
};

@Component({
    selector: 'menu-item-test-host-component',
    template: '<scrm-menu-item [item]="item" [languages]="languages"></scrm-menu-item>'
})
class MenuItemTestHostComponent {
    item: MenuItem = mockMenuItem;
    languages: LanguageStrings = {
        ...languageMockData,
        languageKey: 'en_us'
    };

    setItem(value: MenuItem): void {
        this.item = value;
    }

    setLanguages(value: LanguageStrings): void {
        this.languages = value;
    }
}

describe('ModuleMenuItemComponent', () => {
    let testHostComponent: MenuItemTestHostComponent;
    let testHostFixture: ComponentFixture<MenuItemTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                MenuItemComponent,
                MenuItemLinkComponent,
                MenuItemTestHostComponent,
                MenuRecentlyViewedComponent
            ],
            imports: [
                AngularSvgIconModule,
                RouterTestingModule,
                HttpClientTestingModule,
                ImageModule,
                NgbModule
            ],
            providers: [
                {
                    provide: ThemeImagesStore, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(MenuItemTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have top link', () => {


        const spanElement = testHostFixture.nativeElement.querySelector('span');
        const topLinks = spanElement.getElementsByClassName('top-nav-link');
        const topLink = topLinks[0];

        expect(testHostComponent).toBeTruthy();
        expect(spanElement).toBeTruthy();
        expect(topLinks.length).toEqual(1);
        expect(topLink.textContent).toContain(mockMenuItem.link.label);

    });

    it('should have sub links', () => {

        const divElement = testHostFixture.nativeElement.querySelector('div');
        const subLinks = divElement.getElementsByClassName('sub-nav-link');

        expect(testHostComponent).toBeTruthy();
        expect(divElement).toBeTruthy();
        expect(subLinks.length).toEqual(2);
    });
});
