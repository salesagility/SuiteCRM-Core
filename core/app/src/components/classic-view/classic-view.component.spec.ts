import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {ClassicViewUiComponent} from './classic-view.component';
import {ApiService} from '@services/api/api.service';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';

describe('ClassicViewUiComponent', () => {
    let component: ClassicViewUiComponent;
    let fixture: ComponentFixture<ClassicViewUiComponent>;
    const route = ({
        data: { view: { html: '<h1>haha</h1>' }},
        snapshot: {
            data: { view: { html: '<h1>haha</h1>' }}
        }
    } as any) as ActivatedRoute;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
            providers: [{ provide: ActivatedRoute, useValue: route }],
            declarations: [ClassicViewUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClassicViewUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it(`should create`, async(inject([HttpTestingController],
        (router: RouterTestingModule, http: HttpTestingController, api: ApiService) => {

            expect(component).toBeTruthy();
            expect(component.data.view.html).toEqual('<h1>haha</h1>');
        })));

    it(`should display provided html`, async(inject([HttpTestingController],
        (router: RouterTestingModule, http: HttpTestingController, api: ApiService) => {

            const classicElement: HTMLElement = fixture.nativeElement;
            expect(classicElement.innerHTML).toContain('<h1>haha</h1>');
        })));
});
