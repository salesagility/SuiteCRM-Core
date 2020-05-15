import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupedMenuItemComponent} from './grouped-menu-item.component';
import {MenuItemLinkComponent} from '@components/navbar/menu-item-link/menu-item-link.component';
import {MenuRecentlyViewedComponent} from '@components/navbar/menu-recently-viewed/menu-recently-viewed.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ImageModule} from '@components/image/image.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {of} from 'rxjs';
import {themeImagesMockData} from '@base/facades/theme-images/theme-images.facade.spec.mock';
import {take} from 'rxjs/operators';
import {Component} from '@angular/core';
import {MenuItem} from '@components/navbar/navbar.abstract';
import {LanguageStrings} from '@base/facades/language/language.facade';
import {languageMockData} from '@base/facades/language/language.facade.spec.mock';

const groupedMockMenuItem = {
    link: {
        url: '',
        label: 'Top Link Label',
        route: '',
    },
    icon: '',
    submenu: [
        {
            link: {
                url: '',
                label: 'Sub Link 1',
                route: '/fake-module',
            },
            icon: '',
            submenu: [
                {
                    link: {
                        url: '',
                        label: 'Sub Link 1 item 1',
                        route: '/fake-module/edit',
                    },
                    icon: 'plus',
                    submenu: []
                },
            ]
        },
        {
            link: {
                url: '',
                label: 'Sub Link 2',
                route: '/fake-module/list',
            },
            icon: '',
            submenu: [
                {
                    link: {
                        url: '',
                        label: 'Sub Link 2 item 1',
                        route: '/fake-module/edit',
                    },
                    icon: 'plus',
                    submenu: []
                },
            ]
        }
    ],
    recentRecords: null
}

@Component({
    selector: 'grouped-menu-item-test-host-component',
    template: '<scrm-grouped-menu-item [item]="item" [languages]="languages" [subNavCollapse]="subNavCollapse"></scrm-grouped-menu-item>'
})
class GroupedMenuItemTestHostComponent {
    item: MenuItem = groupedMockMenuItem;
    languages: LanguageStrings = {
        ...languageMockData,
        languageKey: 'en_us'
    };
    subNavCollapse = true;

    setItem(value: MenuItem): void {
        this.item = value;
    }

    setLanguages(value: LanguageStrings): void {
        this.languages = value;
    }
}

describe('GroupedMenuItemComponent', () => {
    let testHostComponent: GroupedMenuItemTestHostComponent;
    let testHostFixture: ComponentFixture<GroupedMenuItemTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GroupedMenuItemComponent,
                MenuItemLinkComponent,
                GroupedMenuItemTestHostComponent,
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
                    provide: ThemeImagesFacade, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(GroupedMenuItemTestHostComponent);
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
        expect(topLink.textContent).toContain(groupedMockMenuItem.link.label);

    });

    it('should have sub links', () => {

        const ulElement = testHostFixture.nativeElement.querySelector('ul');
        const subLinks = ulElement.getElementsByClassName('sub-nav-link');

        expect(testHostComponent).toBeTruthy();
        expect(ulElement).toBeTruthy();
        expect(subLinks.length).toEqual(2);
    });

    it('should have sub links items', () => {

        const ulElement = testHostFixture.nativeElement.querySelector('ul');
        const subLinks = ulElement.getElementsByClassName('submenu');

        let subLink; let subLinksItems;
        for (let i = 0; i < 2; i++) {
            subLink = subLinks[i];
            subLinksItems = subLink.getElementsByClassName('submenu-nav-link');

            expect(subLinksItems.length).toEqual(1);
            expect(subLinksItems[0].textContent).toContain(`item 1`);
        }
    });
});
