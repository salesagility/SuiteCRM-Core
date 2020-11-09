import {Component, OnInit} from '@angular/core';
import {BaseChartComponent} from '@components/chart/components/base-chart/base-chart.component';
import {SingleSeries} from '@app-common/containers/chart/chart.model';
import {isFalse} from '@app-common/utils/value-utils';

@Component({
    selector: 'scrm-vertical-bar-chart',
    templateUrl: './vertical-bar-chart.component.html',
    styleUrls: []
})
export class VerticalBarChartComponent extends BaseChartComponent implements OnInit {

    results: SingleSeries;

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
        });
    }

    get scheme(): string {
        return this.dataSource.options.scheme || 'picnic';
    }

    get gradient(): boolean {
        return this.dataSource.options.gradient || false;
    }

    get xAxis(): boolean {
        return this.dataSource.options.xAxis || false;
    }

    get yAxis(): boolean {
        return !isFalse(this.dataSource.options.yAxis);
    }

    get legend(): boolean {
        return !isFalse(this.dataSource.options.legend);
    }

    get showXAxisLabel(): boolean {
        return this.dataSource.options.showXAxisLabel || false;
    }

    get showYAxisLabel(): boolean {
        return this.dataSource.options.showYAxisLabel || false;
    }

    get xAxisLabel(): string {
        return this.dataSource.options.xAxisLabel || '';
    }

    get yAxisLabel(): string {
        return this.dataSource.options.yAxisLabel || '';
    }

    get yAxisTickFormatting(): Function {
        if (this.dataSource.options.yAxisTickFormatting) {
            return this.dataSource.tickFormatting;
        }
        return null;
    }
}
