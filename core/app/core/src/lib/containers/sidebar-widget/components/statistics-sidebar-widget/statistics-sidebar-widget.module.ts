import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatisticsSidebarWidgetComponent} from './statistics-sidebar-widget.component';
import {FieldModule} from '../../../../fields/field.module';
import {InlineLoadingSpinnerModule} from '../../../../components/inline-loading-spinner/inline-loading-spinner.module';
import {WidgetPanelModule} from '../../../../components/widget-panel/widget-panel.module';
import {LabelModule} from '../../../../components/label/label.module';
import {GridWidgetModule} from '../../../../components/grid-widget/grid-widget.module';

@NgModule({
    declarations: [StatisticsSidebarWidgetComponent],
    exports: [
        StatisticsSidebarWidgetComponent
    ],
    imports: [
        CommonModule,
        FieldModule,
        InlineLoadingSpinnerModule,
        WidgetPanelModule,
        GridWidgetModule,
        LabelModule
    ]
})
export class StatisticsSidebarWidgetModule {
}
