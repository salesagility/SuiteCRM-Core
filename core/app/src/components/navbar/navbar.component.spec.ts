import {async, ComponentFixture, TestBed, inject, fakeAsync, tick} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NavbarUiComponent} from './navbar.component';
import {NavigationFacade} from '@base/facades/navigation/navigation.facade';
import {LanguageFacade} from '@base/facades/language/language.facade';
import {navigationMock} from '@base/facades/navigation/navigation.facade.spec.mock';
import {languageFacadeMock} from '@base/facades/language/language.facade.spec.mock';

describe('NavbarUiComponent', () => {


    describe('Test with mock service', () => {
        let component: NavbarUiComponent;
        let fixture: ComponentFixture<NavbarUiComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                imports: [
                    RouterTestingModule,
                    HttpClientTestingModule,
                    NgbModule
                ],
                providers: [
                    {provide: NavigationFacade, useValue: navigationMock},
                    {provide: LanguageFacade, useValue: languageFacadeMock},
                ],
                declarations: [NavbarUiComponent]
            }).compileComponents();
            fixture = TestBed.createComponent(NavbarUiComponent);
            component = fixture.componentInstance;
        });

        it('should create', () => {
            fixture.detectChanges();

            expect(component).toBeTruthy();
        });

        /*
        it('should get metadata', async (() => {
            fixture.detectChanges(); // onInit()

            fixture.whenStable().then(() => {
                expect(component.navbar).toEqual(jasmine.objectContaining(navigationMockData.navbar));
            });

            component.ngOnInit();
        }));

         */
    });

});
