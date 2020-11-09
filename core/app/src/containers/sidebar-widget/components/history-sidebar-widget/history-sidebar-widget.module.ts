import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ImageModule} from '@components/image/image.module';
import {FieldModule} from '@fields/field.module';
import {WidgetPanelModule} from '@components/widget-panel/widget-panel.module';
import {HistorySidebarWidgetComponent} from './history-sidebar-widget.component';

@NgModule({
    declarations: [HistorySidebarWidgetComponent],
    exports: [
        HistorySidebarWidgetComponent
    ],
    imports: [
        CommonModule,
        ScrollingModule,
        ImageModule,
        FieldModule,
        WidgetPanelModule
    ]
})
export class HistorySidebarWidgetModule {
}
