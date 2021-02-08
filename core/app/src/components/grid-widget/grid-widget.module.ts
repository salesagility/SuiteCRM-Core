import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FieldModule} from '@fields/field.module';
import {InlineLoadingSpinnerModule} from '@components/inline-loading-spinner/inline-loading-spinner.module';
import {WidgetPanelModule} from '@components/widget-panel/widget-panel.module';
import {GridWidgetComponent} from '@components/grid-widget/grid-widget.component';
import {LabelModule} from '@components/label/label.module';
import {ImageModule} from '@components/image/image.module';
import {DynamicLabelModule} from '@components/dynamic-label/dynamic-label.module';

@NgModule({
    declarations: [GridWidgetComponent],
    exports: [
        GridWidgetComponent
    ],
    imports: [
        CommonModule,
        FieldModule,
        InlineLoadingSpinnerModule,
        WidgetPanelModule,
        LabelModule,
        ImageModule,
        DynamicLabelModule
    ]
})
export class GridWidgetModule {
}
