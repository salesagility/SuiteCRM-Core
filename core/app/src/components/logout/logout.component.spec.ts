import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {LogoutUiComponent} from './logout.component';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {AuthService} from '@services/auth/auth.service';
import {LanguageFacade} from "@store/language/language.facade";
import {of} from "rxjs";
import {languageFacadeMock} from "@store/language/language.facade.spec.mock";
import {take} from "rxjs/operators";

describe('LogoutComponent', () => {
    let component: LogoutUiComponent;
    let fixture: ComponentFixture<LogoutUiComponent>;

    const authServiceMock = {
        logout: jasmine.createSpy('logout')
    };

    const label = 'LBL_LOGOUT';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                ApolloTestingModule
            ],
            declarations: [LogoutUiComponent],
            providers: [
                {
                    provide: AuthService, useValue: authServiceMock
                },
                {
                    provide: LanguageFacade, useValue: {
                        vm$: of(languageFacadeMock).pipe(take(1))
                    }
                },
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LogoutUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.logout.logoutAction.label).toBeTruthy();
    });

    it('should have the correct label', () => {
        expect(component).toBeTruthy();
        expect(component.logout.logoutAction.label).toEqual(label);
    });

    it('should call logout component', () => {
        expect(component).toBeTruthy();
        component.doLogout();

        expect(authServiceMock.logout).toHaveBeenCalledWith();
    });
});
