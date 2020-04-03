import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WidgetUiComponent} from './widget.component';

import {ChartUiModule} from '@components/chart/chart.module';
import {ImageModule} from '@components/image/image.module';

@NgModule({
    declarations: [WidgetUiComponent],
    exports: [WidgetUiComponent],
    imports: [
        CommonModule,
        ChartUiModule,
        ImageModule
    ]
})
export class WidgetUiModule {
}
