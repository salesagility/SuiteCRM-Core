import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NavbarUiComponent} from './navbar.component';
import {NavigationFacade} from '@store/navigation/navigation.facade';
import {LanguageFacade} from '@store/language/language.facade';
import {navigationMock} from '@store/navigation/navigation.facade.spec.mock';
import {languageFacadeMock} from '@store/language/language.facade.spec.mock';
import {UserPreferenceFacade} from '@store/user-preference/user-preference.facade';
import {userPreferenceFacadeMock} from '@store/user-preference/user-preference.facade.spec.mock';
import {ApolloTestingModule} from "apollo-angular/testing";

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
                    NgbModule,
                    ApolloTestingModule
                ],
                providers: [
                    {provide: NavigationFacade, useValue: navigationMock},
                    {provide: LanguageFacade, useValue: languageFacadeMock},
                    {provide: UserPreferenceFacade, useValue: userPreferenceFacadeMock},
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

    });

});
