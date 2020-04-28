import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginUiComponent} from './login.component';
import {LanguageFacade} from '@base/facades/language/language.facade';
import {SystemConfigFacade} from '@base/facades/system-config/system-config.facade';
import {RecoverPasswordService} from '@services/process/processes/recover-password/recover-password';
import {languageFacadeMock} from '@base/facades/language/language.facade.spec.mock';
import {systemConfigFacadeMock} from '@base/facades/system-config/system-config.facade.spec.mock';
import {recoverPasswordMock} from '@services/process/processes/recover-password/recover-password.spec.mock';
import {By} from '@angular/platform-browser';
import {ApolloTestingModule} from 'apollo-angular/testing';

describe('LoginComponent', () => {
    let component: LoginUiComponent;
    let fixture: ComponentFixture<LoginUiComponent>;

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                FormsModule,
                BrowserAnimationsModule,
                ApolloTestingModule
            ],
            declarations: [LoginUiComponent],
            providers: [
                {provide: SystemConfigFacade, useValue: systemConfigFacadeMock},
                {provide: LanguageFacade, useValue: languageFacadeMock},
                {provide: RecoverPasswordService, useValue: recoverPasswordMock},
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should flip on forgot password click', () => {
        expect(component).toBeTruthy();
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('[name="email"]'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.submit-button'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.back-link'))).toBeNull();

        expect(fixture.debugElement.query(By.css('[name="password"]'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('#login-button'))).toBeTruthy();
        component.flipCard();

        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('[name="password"]'))).toBeNull();
        expect(fixture.debugElement.query(By.css('#login-button'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.forgotten-password'))).toBeNull();

        expect(fixture.debugElement.query(By.css('[name="email"]'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('.submit-button'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('.back-link'))).toBeTruthy();
    });

    it('should output login fail status', () => {
        expect(component).toBeTruthy();
        console.log = jasmine.createSpy('log');
        component.onLoginError(component);

        expect(console.log).toHaveBeenCalledWith('Login failed');
    });
});
