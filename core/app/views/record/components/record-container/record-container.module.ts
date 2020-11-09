import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {RecordContainerComponent} from './record-container.component';
import {WidgetPanelModule} from '@components/widget-panel/widget-panel.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {SubpanelContainerModule} from '@containers/subpanel/components/subpanel-container/subpanel-container.module';
import {RecordContentModule} from '@components/record-content/record-content.module';
import {TopWidgetModule} from '@containers/top-widget/components/top-widget/top-widget.module';
import {SidebarWidgetModule} from '@containers/sidebar-widget/components/sidebar-widget/sidebar-widget.module';

@NgModule({
    declarations: [RecordContainerComponent],
    exports: [RecordContainerComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(RecordContainerComponent),
        WidgetPanelModule,
        AngularSvgIconModule,
        SubpanelContainerModule,
        RecordContentModule,
        TopWidgetModule,
        SidebarWidgetModule
    ]
})
export class RecordContainerModule {
}
