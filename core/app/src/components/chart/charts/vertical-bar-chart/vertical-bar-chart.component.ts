import {Component, Input, OnInit} from '@angular/core';
import {
    VerticalBarChartDataSource,
    VerticalBarChartResult
} from '@components/chart/charts/vertical-bar-chart/vertical-bar-chart.model';

@Component({
    selector: 'scrm-vertical-bar-chart',
    templateUrl: './vertical-bar-chart.component.html',
    styleUrls: []
})
export class VerticalBarChartComponent implements OnInit {
    @Input() dataSource: VerticalBarChartDataSource;

    results: VerticalBarChartResult[];
    width = 300;
    view = [300, this.width];

    constructor() {
        this.calculateView();
    }

    ngOnInit(): void {
        if (this.dataSource.width) {
            this.width = this.dataSource.width;
        }

        this.dataSource.getResults().subscribe(value => {
            this.results = value;
        });
    }


    onResize(): void {
        this.calculateView();
    }

    protected calculateView(): void {
        this.view = [window.innerWidth * 0.22, this.width];
    }
}
