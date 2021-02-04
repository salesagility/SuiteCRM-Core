import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {Component} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {AngularSvgIconModule} from 'angular-svg-icon';
import {ImageModule} from '@components/image/image.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MenuItemsListComponent} from './menu-items-list.component';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {MenuItemComponent} from '@components/navbar/menu-item/menu-item.component';
import {MenuItemLinkComponent} from '@components/navbar/menu-item-link/menu-item-link.component';
import {MenuRecentlyViewedComponent} from '@components/navbar/menu-recently-viewed/menu-recently-viewed.component';


const mockMenuItems = [
    {
        link: {
            url: '',
            label: 'Menu Item 1',
            route: '/fake-module-1',
        },
        icon: '',
        submenu: [],
        recentRecords: null
    },
    {
        link: {
            url: '',
            label: 'Menu Item 2',
            route: '/fake-module-2',
        },
        icon: '',
        submenu: [],
        recentRecords: null
    }
];

@Component({
    selector: 'menu-item-list-test-host-component',
    template: '<scrm-menu-items-list [items]="items" [label]="label"></scrm-menu-items-list>'
})
class MenuItemListTestHostComponent {
    items = mockMenuItems;
    label = 'More';
}

describe('MenuItemsListComponent', () => {
    let testHostComponent: MenuItemListTestHostComponent;
    let testHostFixture: ComponentFixture<MenuItemListTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                MenuItemComponent,
                MenuItemLinkComponent,
                MenuItemsListComponent,
                MenuRecentlyViewedComponent,
                MenuItemListTestHostComponent
            ],
            imports: [
                AngularSvgIconModule.forRoot(),
                RouterTestingModule,
                HttpClientTestingModule,
                ImageModule,
                NgbModule,
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
        testHostFixture = TestBed.createComponent(MenuItemListTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have label', () => {

        const navItemLink = testHostFixture.nativeElement.querySelector('a');

        expect(navItemLink.text).toContain('More');
    });

    it('should have menu items', () => {

        const navItemLink = testHostFixture.nativeElement.querySelector('div');
        const links = navItemLink.getElementsByClassName('action-link');

        expect(links.length).toEqual(2);
        expect(links[0].textContent).toContain('Menu Item 1');
        expect(links[0].attributes.getNamedItem('href').value).toContain('/fake-module-1');
        expect(links[1].textContent).toContain('Menu Item 2');
        expect(links[1].attributes.getNamedItem('href').value).toContain('/fake-module-2');
    });
});
