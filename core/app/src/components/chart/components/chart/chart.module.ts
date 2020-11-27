import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartComponent} from './chart.component';
import {DynamicModule} from 'ng-dynamic-component';
import {chartModules} from '@components/chart/components/chart/chart.manifest';
import {ChartMessageAreaModule} from '@components/chart/components/chart-message-area/chart-message-area.module';

@NgModule({
    declarations: [ChartComponent],
    exports: [ChartComponent],
    imports: [
        CommonModule,
        ...chartModules,
        DynamicModule,
        ChartMessageAreaModule
    ]
})
export class ChartModule {
}
