import {async, ComponentFixture, TestBed, inject, tick, fakeAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginUiComponent} from './login.component';
import {ApiService} from '../../services/api/api.service';
import {LanguageFacade} from '@base/facades/language/language.facade';
import {SystemConfigFacade} from '@base/facades/system-config/system-config.facade';
import {RecoverPasswordService} from '@services/process/processes/recover-password/recover-password';
import {languageFacadeMock} from '@base/facades/language/language.facade.spec.mock';
import {systemConfigFacadeMock} from '@base/facades/system-config/system-config.facade.spec.mock';
import {
    recoverPasswordMock,
    recoverPasswordMockData
} from '@services/process/processes/recover-password/recover-passoword.spec.mock';
import {By} from '@angular/platform-browser';
import {Observable, of} from 'rxjs';

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
                BrowserAnimationsModule
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

    it('should create', async(inject([HttpTestingController],
        (router: RouterTestingModule, http: HttpTestingController, api: ApiService) => {
            expect(component).toBeTruthy();
        })));

    it('should flip on forgot password click', async(inject([HttpTestingController],
        (router: RouterTestingModule, http: HttpTestingController, api: ApiService) => {
            fixture.whenStable().then(() => {
                expect(component).toBeTruthy();
                fixture.detectChanges();
                expect(fixture.debugElement.query(By.css('[name="email"]'))).toBeNull();
                expect(fixture.debugElement.query(By.css('.submit-button'))).toBeNull();
                expect(fixture.debugElement.query(By.css('.back-link'))).toBeNull();

                expect(fixture.debugElement.query(By.css('[name="password"]'))).toBeTruthy();
                expect(fixture.debugElement.query(By.css('#login-button'))).toBeTruthy();
                component.flipCard();
                // same test codmockRecoverPasswordServicee here
                fixture.detectChanges();
                expect(fixture.debugElement.query(By.css('[name="password"]'))).toBeNull();
                expect(fixture.debugElement.query(By.css('#login-button'))).toBeNull();
                expect(fixture.debugElement.query(By.css('.forgotten-password'))).toBeNull();

                expect(fixture.debugElement.query(By.css('[name="email"]'))).toBeTruthy();
                expect(fixture.debugElement.query(By.css('.submit-button'))).toBeTruthy();
                expect(fixture.debugElement.query(By.css('.back-link'))).toBeTruthy();
            });
        })));

});
