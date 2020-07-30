import {Component, Input, OnInit} from '@angular/core';
import {
    VerticalBarChartDataSource,
    VerticalBarChartResult
} from '@components/chart/charts/vertical-bar-chart/vertical-bar-chart.model';
import {BaseChartComponent} from '@components/chart/charts/base-chart/base-chart.component';

@Component({
    selector: 'scrm-vertical-bar-chart',
    templateUrl: './vertical-bar-chart.component.html',
    styleUrls: []
})
export class VerticalBarChartComponent extends BaseChartComponent implements OnInit {
    @Input() dataSource: VerticalBarChartDataSource;

    results: VerticalBarChartResult[];

    constructor() {
        super();
    }

    ngOnInit(): void {
        if (this.dataSource.height) {
            this.height = this.dataSource.height;
        }

        this.calculateView();

        this.dataSource.getResults().subscribe(value => {
            this.results = value;
        });
    }
}
