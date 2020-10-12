import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WidgetComponent} from './widget.component';
import {ImageModule} from '@components/image/image.module';

@NgModule({
    declarations: [WidgetComponent],
    exports: [WidgetComponent],
    imports: [
        CommonModule,
        ImageModule
    ]
})
export class WidgetModule {
}
