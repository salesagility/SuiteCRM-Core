import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {ChartUiComponent} from './chart.component';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {take} from 'rxjs/operators';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';
import {ListViewStore} from '@store/list-view/list-view.store';

describe('ChartComponent', () => {
    let component: ChartUiComponent;
    let fixture: ComponentFixture<ChartUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, HttpClientTestingModule, ApolloTestingModule],
            providers: [
                {provide: ListViewStore, useValue: listviewStoreMock},
                {provide: ThemeImagesStore, useValue: {images$: of(themeImagesMockData).pipe(take(1))}},
            ],
            declarations: [ChartUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', async(inject([HttpTestingController],
        (httpClient: HttpTestingController) => {
            expect(component).toBeTruthy();
        })));
});
