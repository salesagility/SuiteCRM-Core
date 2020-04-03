import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ChartUiComponent} from './chart.component';
import {ImageModule} from '@components/image/image.module';

@NgModule({
    declarations: [ChartUiComponent],
    exports: [ChartUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ChartUiComponent),
        ImageModule
    ]
})
export class ChartUiModule {
}
