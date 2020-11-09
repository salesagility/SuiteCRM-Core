import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WidgetPanelComponent} from './widget-panel.component';
import {ImageModule} from '@components/image/image.module';
import {PanelModule} from '@components/panel/panel.module';

@NgModule({
    declarations: [WidgetPanelComponent],
    exports: [WidgetPanelComponent],
    imports: [
        CommonModule,
        ImageModule,
        PanelModule
    ]
})
export class WidgetPanelModule {
}
