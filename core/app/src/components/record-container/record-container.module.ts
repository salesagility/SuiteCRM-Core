import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '../../app-manager/app-manager.module';
import {RecordContainerComponent} from './record-container.component';
import {WidgetModule} from '../widget/widget.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {SubpanelContainerModule} from '@components/subpanel-container/subpanel-container.module';
import {RecordContentModule} from '@components/record-content/record-content.module';
import {HistoryTimelineWidgetModule} from '@components/history-timeline-widget/history-timeline-widget.module';

@NgModule({
    declarations: [RecordContainerComponent],
    exports: [RecordContainerComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(RecordContainerComponent),
        WidgetModule,
        AngularSvgIconModule,
        SubpanelContainerModule,
        RecordContentModule,
        HistoryTimelineWidgetModule
    ]
})
export class RecordContainerModule {
}
