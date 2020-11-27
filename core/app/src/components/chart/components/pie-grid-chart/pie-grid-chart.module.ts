import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PieGridChartComponent} from './pie-grid-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartMessageAreaModule} from '@components/chart/components/chart-message-area/chart-message-area.module';

@NgModule({
    declarations: [PieGridChartComponent],
    exports: [PieGridChartComponent],
    imports: [
        CommonModule,
        NgxChartsModule,
        ChartMessageAreaModule
    ]
})
export class PieGridChartModule {
}
