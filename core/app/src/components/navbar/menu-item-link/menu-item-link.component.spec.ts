import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularSvgIconModule} from 'angular-svg-icon';


import {themeImagesMockData} from '@store/theme-images/theme-images.facade.spec.mock';

import {MenuItemLinkComponent} from './menu-item-link.component';
import {MenuItemLink} from '@components/navbar/navbar.abstract';
import {ThemeImagesFacade} from '@store/theme-images/theme-images.facade';
import {ImageModule} from '@components/image/image.module';

const mockLink = {
    label: 'Test Link Label',
    url: '/fake-module/edit?return_module=Opportunities&return_action=DetailView',
    route: '/fake-module/edit',
    params: {
        'return-module': 'FakeModule',
        'return-action': 'DetailView',
    }
};

@Component({
    selector: 'menu-item-link-test-host-component',
    template: '<scrm-menu-item-link [class]="class" [link]="link" [icon]="icon"></scrm-menu-item-link>'
})
class MenuItemLinkTestHostComponent {
    class = '';
    link: MenuItemLink = mockLink;
    icon = '';

    setClass(value: string): void {
        this.class = value;
    }

    setLink(value: MenuItemLink): void {
        this.link = value;
    }

    setIcon(value: string): void {
        this.icon = value;
    }
}


describe('MenuItemActionLinkComponent', () => {
    let testHostComponent: MenuItemLinkTestHostComponent;
    let testHostFixture: ComponentFixture<MenuItemLinkTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MenuItemLinkComponent, MenuItemLinkTestHostComponent],
            imports: [
                AngularSvgIconModule,
                RouterTestingModule,
                HttpClientTestingModule,
                ImageModule,
                NgbModule,
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
        testHostFixture = TestBed.createComponent(MenuItemLinkTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
        const linkElement = testHostFixture.nativeElement.querySelector('a');

        expect(linkElement).toBeTruthy();
        expect(linkElement.className).toEqual('');
        expect(testHostFixture.nativeElement.querySelector('svg-icon')).toBeFalsy();
    });

    it('should have image', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.setIcon('plus')
        testHostFixture.detectChanges();

        expect(testHostFixture.nativeElement.querySelector('svg-icon')).toBeTruthy();
    });

    it('should use route', () => {

        expect(testHostComponent).toBeTruthy();

        const linkElement = testHostFixture.nativeElement.querySelector('a');
        const url = '/fake-module/edit?return-module=FakeModule&return-action=DetailView';

        expect(linkElement).toBeTruthy();
        expect(linkElement.href).toContain(url);
        expect(linkElement.text).toContain(mockLink.label);
    });

    it('should use href', () => {
        expect(testHostComponent).toBeTruthy();

        const link = {
            label: 'Test Link Label',
            url: './fake-module/edit?return_module=FakeModule&return_action=DetailView',
            route: null,
            params: null
        };

        testHostComponent.setLink(link)
        testHostFixture.detectChanges();


        const linkElement = testHostFixture.nativeElement.querySelector('a');
        const url = '/fake-module/edit?return_module=FakeModule&return_action=DetailView';
        expect(linkElement).toBeTruthy();
        expect(linkElement.href).toContain(url);
        expect(linkElement.text).toContain(mockLink.label);
    });

    it('should have class', () => {
        expect(testHostComponent).toBeTruthy();

        const testClass = 'test-class';
        testHostComponent.setClass(testClass)
        testHostFixture.detectChanges();


        const linkElement = testHostFixture.nativeElement.querySelector('a');

        expect(linkElement).toBeTruthy();
        expect(linkElement.className).toContain(testClass);
    });

});
