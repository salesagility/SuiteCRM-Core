import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CommonModule} from '@angular/common';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {RouterTestingModule} from '@angular/router/testing';

import {AppManagerModule} from '../../app-manager/app-manager.module';

import {Router} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ListViewUiComponent} from './list-view.component';

let mockRouter: any;

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

export const testImports = [
    CommonModule,
    RouterTestingModule,
    HttpClientModule,
    AppManagerModule.forChild(ListViewUiComponent),
    BrowserAnimationsModule,
];

describe('ListViewUIComponent', () => {
    let component: ListViewUiComponent;
    let fixture: ComponentFixture<ListViewUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListViewUiComponent],
            imports: testImports,
            providers: [{provide: Router, useValue: mockRouter}],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListViewUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should default to ascending', () => {
        expect(component.desc).toBe('ASC');
    });

    it('should toggle to descending', () => {
        component.order('city');
        component.order('city');
        expect(component.desc).toBe('DESC');
    });
});
