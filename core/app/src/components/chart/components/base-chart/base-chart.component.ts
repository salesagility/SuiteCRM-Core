import {Input} from '@angular/core';
import {ChartDataSource} from '@app-common/containers/chart/chart.model';

export class BaseChartComponent {
    @Input() dataSource: ChartDataSource;

    height = 300;
    view = [300, this.height];

    onResize(): void {
        this.calculateView();
    }

    protected calculateView(): void {
        let width = window.innerWidth * 0.7;

        if (window.innerWidth > 990) {
            width = window.innerWidth * 0.23;
        }
        this.view = [width, this.height];
    }
}
