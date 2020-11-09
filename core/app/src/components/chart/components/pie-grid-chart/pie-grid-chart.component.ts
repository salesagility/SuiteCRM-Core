import {Component, OnInit} from '@angular/core';
import {BaseChartComponent} from '@components/chart/components/base-chart/base-chart.component';
import {SingleSeries} from '@app-common/containers/chart/chart.model';

@Component({
    selector: 'scrm-pie-grid-chart',
    templateUrl: './pie-grid-chart.component.html',
    styleUrls: []
})
export class PieGridChartComponent extends BaseChartComponent implements OnInit {
    results: SingleSeries;
    height = 700;
    view = [300, this.height];

    constructor() {
        super();
    }

    ngOnInit(): void {
        if (this.dataSource.options.height) {
            this.height = this.dataSource.options.height;
        }

        this.calculateView();

        this.dataSource.getResults().subscribe(value => {
            this.results = value.singleSeries;
            this.calculateHeightBasedOnResults();
            this.calculateView();

        });
    }

    get scheme(): string {
        return this.dataSource.options.scheme || 'picnic';
    }

    get label(): string {
        return this.dataSource.options.label || '';
    }

    onResize(): void {
        this.calculateHeightBasedOnResults();
        this.calculateView();
    }

    protected calculateHeightBasedOnResults(): void {
        if (this.results && this.results.length) {
            const perRow = Math.floor(this.view[0] / 170);
            this.height = (Math.floor(this.results.length / perRow) * 200);
        } else {
            this.height = 50;
        }
    }

}
