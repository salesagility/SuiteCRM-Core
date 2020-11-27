import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LineChartComponent} from '@components/chart/components/line-chart/line-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartMessageAreaModule} from '@components/chart/components/chart-message-area/chart-message-area.module';


@NgModule({
    declarations: [LineChartComponent],
    exports: [LineChartComponent],
    imports: [
        CommonModule,
        NgxChartsModule,
        ChartMessageAreaModule
    ]
})
export class LineChartModule {
}
