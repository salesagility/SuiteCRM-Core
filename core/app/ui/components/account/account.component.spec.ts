import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CommonModule} from '@angular/common';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {RouterTestingModule} from '@angular/router/testing';

import {PluginManagerModule} from '../../../plugin-manager/plugin-manager.module';

import {SharedModule} from '../../shared/shared.module';

import {AccountComponent} from './account.component';
import {AppModule} from '../../../app.module';
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
    SharedModule,
    PluginManagerModule.forChild(AccountComponent),
];

describe('AccountComponent', () => {
    let component: AccountComponent;
    let fixture: ComponentFixture<AccountComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AccountComponent,
            ],
            imports: testImports,
            providers: [{provide: Router, useValue: mockRouter}],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});