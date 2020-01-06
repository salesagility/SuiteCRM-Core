import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CommonModule} from '@angular/common';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {RouterTestingModule} from '@angular/router/testing';

import {AppManagerModule} from '../../../../app-manager/app-manager.module';

import {AccountUiComponent} from './account.component';
import {AppModule} from '../../../../app.module';
import {Router} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

let mockRouter: any;

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

export const testImports = [
    CommonModule,
    RouterTestingModule,
    HttpClientModule,
    AppManagerModule.forChild(AccountUiComponent),
];

describe('AccountComponent', () => {
    let component: AccountUiComponent;
    let fixture: ComponentFixture<AccountUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
              AccountUiComponent,
            ],
            imports: testImports,
            providers: [{provide: Router, useValue: mockRouter}],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccountUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
