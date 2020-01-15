import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {ChartUiComponent} from './chart.component';

describe('ChartComponent', () => {
    let component: ChartUiComponent;
    let fixture: ComponentFixture<ChartUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, HttpClientTestingModule],
            declarations: [ChartUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it(`should create`, async(inject([HttpTestingController],
        (httpClient: HttpTestingController) => {
            expect(component).toBeTruthy();
        })));
});
