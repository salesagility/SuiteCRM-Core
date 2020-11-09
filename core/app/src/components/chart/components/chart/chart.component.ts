import {Component, Input, OnInit} from '@angular/core';
import {ChartDataSource} from '@app-common/containers/chart/chart.model';
import {chartTypeMap} from '@components/chart/components/chart/chart.manifest';

@Component({
    selector: 'scrm-chart',
    templateUrl: './chart.component.html',
    styleUrls: []
})
export class ChartComponent implements OnInit {
    @Input('dataSource') dataSource: ChartDataSource = null;
    @Input('type') type: string;

    map = chartTypeMap;

    get chartType(): any {
        return this.map[this.type];
    }

    constructor() {
    }

    ngOnInit(): void {
    }

    isConfigured(): boolean {
        return !!(this.type && this.dataSource && this.chartType);
    }
}
