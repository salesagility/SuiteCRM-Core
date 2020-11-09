import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PieGridChartComponent} from './pie-grid-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';


@NgModule({
    declarations: [PieGridChartComponent],
    exports: [PieGridChartComponent],
    imports: [
        CommonModule,
        NgxChartsModule
    ]
})
export class PieGridChartModule {
}
