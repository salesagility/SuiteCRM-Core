import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VerticalBarChartComponent} from './vertical-bar-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartMessageAreaModule} from '@components/chart/components/chart-message-area/chart-message-area.module';

@NgModule({
    declarations: [VerticalBarChartComponent],
    exports: [VerticalBarChartComponent],
    imports: [
        CommonModule,
        NgxChartsModule,
        ChartMessageAreaModule
    ]
})
export class VerticalBarChartModule {
}
