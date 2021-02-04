import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {HomeMenuItemComponent} from './home-menu-item.component';
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
import {Component} from '@angular/core';

@Component({
    selector: 'home-menu-item-test-host-component',
    template: '<scrm-home-menu-item [active]="active" [route]="route"></scrm-home-menu-item>'
})
class HomeMenuItemTestHostComponent {
    active = false;
    route = '';

    setActive(value: boolean): void {
        this.active = value;
    }

    setRoute(value: string): void {
        this.route = value;
    }
}

describe('HomeMenuItemComponent', () => {
    let testHostComponent: HomeMenuItemTestHostComponent;
    let testHostFixture: ComponentFixture<HomeMenuItemTestHostComponent>;

    beforeEach(waitForAsync(() => {

        TestBed.configureTestingModule({
            declarations: [HomeMenuItemComponent, MenuItemLinkComponent, HomeMenuItemTestHostComponent],
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
        testHostFixture = TestBed.createComponent(HomeMenuItemTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
        const linkElement = testHostFixture.nativeElement.querySelector('li');

        expect(linkElement).toBeTruthy();
        expect(linkElement.className).not.toContain('active');
    });

    it('should have image', () => {
        expect(testHostComponent).toBeTruthy();

        expect(testHostFixture.nativeElement.querySelector('svg-icon')).toBeTruthy();
    });

    it('should active link', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.setActive(true);
        testHostFixture.detectChanges();
        const linkElement = testHostFixture.nativeElement.querySelector('li');

        expect(linkElement).toBeTruthy();
        expect(linkElement.className).toContain('active');
    });

    it('should home link', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.setRoute('/home');
        testHostFixture.detectChanges();
        const linkElement = testHostFixture.nativeElement.querySelector('a');
        const url = '/home';

        expect(linkElement).toBeTruthy();
        expect(linkElement.href).toContain(url);
    });
});
