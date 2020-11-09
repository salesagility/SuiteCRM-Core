import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartSidebarWidgetComponent} from './chart-sidebar-widget.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';

describe('ChartSidebarWidgetComponent', () => {
    let component: ChartSidebarWidgetComponent;
    let fixture: ComponentFixture<ChartSidebarWidgetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChartSidebarWidgetComponent],
            imports: [RouterTestingModule, HttpClientTestingModule, ApolloTestingModule],
            providers: [],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartSidebarWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
