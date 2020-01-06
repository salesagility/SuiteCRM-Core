import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NavbarUiComponent} from './navbar.component';

describe('NavbarUiComponent', () => {
    let component: NavbarUiComponent;
    let fixture: ComponentFixture<NavbarUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, HttpClientTestingModule, NgbModule],
            declarations: [NavbarUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it(`should create`, async(inject([HttpTestingController],
        (httpClient: HttpTestingController) => {
            expect(component).toBeTruthy();
        })));
});
