import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FieldModule} from '../../fields/field.module';
import {InlineLoadingSpinnerModule} from '../inline-loading-spinner/inline-loading-spinner.module';
import {WidgetPanelModule} from '../widget-panel/widget-panel.module';
import {GridWidgetComponent} from './grid-widget.component';
import {LabelModule} from '../label/label.module';
import {DynamicLabelModule} from '../dynamic-label/dynamic-label.module';
import {ImageModule} from '../image/image.module';

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
