import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartSidebarWidgetComponent} from './chart-sidebar-widget.component';
import {WidgetPanelModule} from '@components/widget-panel/widget-panel.module';
import {FormsModule} from '@angular/forms';
import {ChartModule} from '@components/chart/components/chart/chart.module';
import {LoadingSpinnerModule} from '@components/loading-spinner/loading-spinner.module';

@NgModule({
    declarations: [ChartSidebarWidgetComponent],
    exports: [ChartSidebarWidgetComponent],
    imports: [
        CommonModule,
        WidgetPanelModule,
        FormsModule,
        ChartModule,
        LoadingSpinnerModule
    ]
})
export class ChartSidebarWidgetModule {
}
