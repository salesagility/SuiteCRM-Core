import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VerticalBarChartComponent} from './vertical-bar-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';

@NgModule({
    declarations: [VerticalBarChartComponent],
    exports: [VerticalBarChartComponent],
    imports: [
        CommonModule,
        NgxChartsModule
    ]
})
export class VerticalBarChartModule {
}
