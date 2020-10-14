import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WidgetComponent} from './widget.component';
import {ImageModule} from '@components/image/image.module';
import {PanelModule} from '@components/panel/panel.module';

@NgModule({
    declarations: [WidgetComponent],
    exports: [WidgetComponent],
    imports: [
        CommonModule,
        ImageModule,
        PanelModule
    ]
})
export class WidgetModule {
}
