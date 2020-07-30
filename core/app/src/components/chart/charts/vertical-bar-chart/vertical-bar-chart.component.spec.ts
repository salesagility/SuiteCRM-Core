import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VerticalBarChartComponent} from './vertical-bar-chart.component';

describe('VerticalBarChartComponent', () => {
    let component: VerticalBarChartComponent;
    let fixture: ComponentFixture<VerticalBarChartComponent>;

    beforeEach(async(() => {
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

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
