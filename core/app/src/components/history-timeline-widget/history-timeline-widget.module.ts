import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HistoryTimelineWidgetComponent} from './history-timeline-widget.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ImageModule} from '@components/image/image.module';
import {FieldModule} from '@fields/field.module';

@NgModule({
    declarations: [HistoryTimelineWidgetComponent],
    exports: [
        HistoryTimelineWidgetComponent
    ],
    imports: [
        CommonModule,
        ScrollingModule,
        ImageModule,
        FieldModule
    ]
})
export class HistoryTimelineWidgetModule {
}
