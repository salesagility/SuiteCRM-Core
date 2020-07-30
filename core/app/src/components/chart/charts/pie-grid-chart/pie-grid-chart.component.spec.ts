import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PieGridChartComponent} from './pie-grid-chart.component';

describe('PieGridChartComponent', () => {
    let component: PieGridChartComponent;
    let fixture: ComponentFixture<PieGridChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PieGridChartComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PieGridChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
