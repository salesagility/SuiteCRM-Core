import {Component, Input, OnInit} from '@angular/core';
import {
    LineChartDataSource,
    LineChartResult
} from '@components/chart/charts/line-chart/line-chart.model';
import {BaseChartComponent} from '@components/chart/charts/base-chart/base-chart.component';

@Component({
    selector: 'scrm-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: []
})
export class LineChartComponent extends BaseChartComponent implements OnInit {
    @Input() dataSource: LineChartDataSource;

    results: LineChartResult[];

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
