import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FieldModule} from '@fields/field.module';
import {InlineLoadingSpinnerModule} from '@components/inline-loading-spinner/inline-loading-spinner.module';
import {StatisticsSidebarWidgetComponent} from '../statistics-sidebar-widget/statistics-sidebar-widget.component';
import {WidgetPanelModule} from '@components/widget-panel/widget-panel.module';

@NgModule({
    declarations: [StatisticsSidebarWidgetComponent],
    exports: [
        StatisticsSidebarWidgetComponent
    ],
    imports: [
        CommonModule,
        FieldModule,
        InlineLoadingSpinnerModule,
        WidgetPanelModule
    ]
})
export class StatisticsSidebarWidgetModule {
}
