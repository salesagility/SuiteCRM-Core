import {Component, Input, OnInit} from '@angular/core';
import {BaseChartComponent} from '@components/chart/charts/base-chart/base-chart.component';
import {
    PieGridChartChartDataSource,
    PieGridChartResult
} from '@components/chart/charts/pie-grid-chart/pie-grid-chart.model';

@Component({
    selector: 'scrm-pie-grid-chart',
    templateUrl: './pie-grid-chart.component.html',
    styleUrls: []
})
export class PieGridChartComponent extends BaseChartComponent implements OnInit {
    @Input() dataSource: PieGridChartChartDataSource;
    results: PieGridChartResult[];

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
            this.calculateHeightBasedOnResults();
            this.calculateView();

        });
    }

    onResize(): void {
        this.calculateHeightBasedOnResults();
        this.calculateView();
    }

    protected calculateHeightBasedOnResults() {
        if (this.results && this.results.length) {
            const perRow = Math.floor(this.view[0] / 170);
            this.height = (Math.floor(this.results.length / perRow) * 200);
        } else {
            this.height = 50;
        }
    }

}
