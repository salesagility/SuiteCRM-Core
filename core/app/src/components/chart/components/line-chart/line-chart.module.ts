import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LineChartComponent} from '@components/chart/components/line-chart/line-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';


@NgModule({
    declarations: [LineChartComponent],
    exports: [LineChartComponent],
    imports: [
        CommonModule,
        NgxChartsModule
    ]
})
export class LineChartModule {
}
