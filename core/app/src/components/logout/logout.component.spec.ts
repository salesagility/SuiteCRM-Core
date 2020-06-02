import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {LogoutUiComponent} from './logout.component';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {AuthService} from '@services/auth/auth.service';
import {LanguageStore} from '@store/language/language.store';
import {of} from 'rxjs';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {take} from 'rxjs/operators';

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
                    provide: LanguageStore, useValue: {
                        vm$: of(languageStoreMock).pipe(take(1))
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
