import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartComponent} from './chart.component';
import {DynamicModule} from 'ng-dynamic-component';
import {chartModules} from '@components/chart/components/chart/chart.manifest';


@NgModule({
    declarations: [ChartComponent],
    exports: [ChartComponent],
    imports: [
        CommonModule,
        ...chartModules,
        DynamicModule
    ]
})
export class ChartModule {
}
