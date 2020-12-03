import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {VerticalBarChartComponent} from './vertical-bar-chart.component';

describe('VerticalBarChartComponent', () => {
    let component: VerticalBarChartComponent;
    let fixture: ComponentFixture<VerticalBarChartComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [VerticalBarChartComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VerticalBarChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

});
