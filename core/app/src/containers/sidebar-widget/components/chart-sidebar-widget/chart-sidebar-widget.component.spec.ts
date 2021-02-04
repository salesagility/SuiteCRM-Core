import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ChartSidebarWidgetComponent} from './chart-sidebar-widget.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('ChartSidebarWidgetComponent', () => {
    let component: ChartSidebarWidgetComponent;
    let fixture: ComponentFixture<ChartSidebarWidgetComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ChartSidebarWidgetComponent],
            imports: [RouterTestingModule, HttpClientTestingModule, ApolloTestingModule, NoopAnimationsModule],
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
