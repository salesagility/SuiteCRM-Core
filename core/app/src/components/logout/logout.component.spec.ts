import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {LogoutUiComponent} from './logout.component';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {AuthService} from '@services/auth/auth.service';

describe('LogoutComponent', () => {
    let component: LogoutUiComponent;
    let fixture: ComponentFixture<LogoutUiComponent>;

    const authServiceMock = {
        logout: jasmine.createSpy('logout')
    };

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
                {provide: AuthService, useValue: authServiceMock},
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LogoutUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call logout component', () => {
        expect(component).toBeTruthy();
        component.doLogout();

        expect(authServiceMock.logout).toHaveBeenCalledWith();
    });
});
