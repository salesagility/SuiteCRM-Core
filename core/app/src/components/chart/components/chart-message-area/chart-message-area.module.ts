import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartMessageAreaComponent} from '@components/chart/components/chart-message-area/chart-message-area.component';
import {LabelModule} from '@components/label/label.module';

@NgModule({
    declarations: [ChartMessageAreaComponent],
    exports: [ChartMessageAreaComponent],
    imports: [
        CommonModule,
        LabelModule
    ]
})
export class ChartMessageAreaModule {
}
