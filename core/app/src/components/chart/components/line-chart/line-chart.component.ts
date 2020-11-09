import {Component, OnInit} from '@angular/core';
import {BaseChartComponent} from '@components/chart/components/base-chart/base-chart.component';
import {MultiSeries} from '@app-common/containers/chart/chart.model';
import {isFalse} from '@app-common/utils/value-utils';

@Component({
    selector: 'scrm-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: []
})
export class LineChartComponent extends BaseChartComponent implements OnInit {

    results: MultiSeries;
    scheme: string;
    gradient: boolean;
    xAxis: boolean;
    yAxis: boolean;
    legend: boolean;
    xScaleMin: number | string;
    xScaleMax: number | string;
    xAxisTicks: any;
    showXAxisLabel: boolean;
    showYAxisLabel: boolean;
    xAxisLabel: string;
    yAxisLabel: string;
    yAxisTickFormatting: Function;
    xAxisTickFormatting: Function;
    tooltipDisabled: boolean;

    constructor() {
        super();
    }

    ngOnInit(): void {
        if (this.dataSource.options.height) {
            this.height = this.dataSource.options.height;
        }

        this.calculateView();

        this.dataSource.getResults().subscribe(value => {
            this.results = value.multiSeries;
        });

        this.scheme = this.getScheme();
        this.gradient = this.getGradient();
        this.xAxis = this.getXAxis();
        this.yAxis = this.getYAxis();
        this.legend = this.getLegend();
        this.xScaleMin = this.getXScaleMin();
        this.xScaleMax = this.getXScaleMax();
        this.xAxisTicks = this.getXAxisTicks();
        this.showXAxisLabel = this.getShowXAxisLabel();
        this.showYAxisLabel = this.getShowYAxisLabel();
        this.xAxisLabel = this.getXAxisLabel();
        this.yAxisLabel = this.getYAxisLabel();
        this.yAxisTickFormatting = this.getYAxisTickFormatting();
        this.xAxisTickFormatting = this.getXAxisTickFormatting();
        this.tooltipDisabled = this.getTooltipDisabled();
    }

    getScheme(): string {
        return this.dataSource.options.scheme || 'picnic';
    }

    getGradient(): boolean {
        return this.dataSource.options.gradient || false;
    }

    getXAxis(): boolean {
        return !isFalse(this.dataSource.options.xAxis);
    }

    getYAxis(): boolean {
        return !isFalse(this.dataSource.options.yAxis);
    }

    getLegend(): boolean {
        return !isFalse(this.dataSource.options.legend);
    }

    getXScaleMin(): number | string {
        return this.dataSource.options.xScaleMin || null;
    }

    getXScaleMax(): number | string {
        return this.dataSource.options.xScaleMax || null;
    }

    getXAxisTicks(): any {
        return this.dataSource.options.xAxisTicks || null;
    }

    getShowXAxisLabel(): boolean {
        return !isFalse(this.dataSource.options.showXAxisLabel);
    }

    getShowYAxisLabel(): boolean {
        return this.dataSource.options.showYAxisLabel || false;
    }

    getXAxisLabel(): string {
        return this.dataSource.options.xAxisLabel || '';
    }

    getYAxisLabel(): string {
        return this.dataSource.options.yAxisLabel || '';
    }

    getYAxisTickFormatting(): Function {
        if (!this.dataSource.options.yAxisTickFormatting) {
            return null;
        }
        return this.dataSource.tickFormatting || null;
    }

    getXAxisTickFormatting(): Function {
        if (!this.dataSource.options.xAxisTickFormatting) {
            return null;
        }
        return this.dataSource.tickFormatting || null;
    }

    getTooltipDisabled(): boolean {
        return this.dataSource.options.tooltipDisabled || false;
    }
}
