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

import {GroupedMenuItemComponent} from './grouped-menu-item.component';
import {MenuItemLinkComponent} from '@components/navbar/menu-item-link/menu-item-link.component';
import {MenuRecentlyViewedComponent} from '@components/navbar/menu-recently-viewed/menu-recently-viewed.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ImageModule} from '@components/image/image.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ThemeImagesStore} from 'core';
import {of} from 'rxjs';
import {themeImagesMockData} from 'core';
import {take} from 'rxjs/operators';
import {Component} from '@angular/core';
import {LanguageStrings} from 'core';
import {languageMockData} from 'core';
import {MenuItem} from 'common';

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
};

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

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                GroupedMenuItemComponent,
                MenuItemLinkComponent,
                GroupedMenuItemTestHostComponent,
                MenuRecentlyViewedComponent
            ],
            imports: [
                AngularSvgIconModule.forRoot(),
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
            expect(subLinksItems[0].textContent).toContain('item 1');
        }
    });
});
