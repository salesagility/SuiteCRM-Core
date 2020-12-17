import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {ListContainerComponent} from './list-container.component';

import {TableModule} from '@components/table/table.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {WidgetPanelModule} from '@components/widget-panel/widget-panel.module';
import {SidebarWidgetModule} from '@containers/sidebar-widget/components/sidebar-widget/sidebar-widget.module';

@NgModule({
    declarations: [ListContainerComponent],
    exports: [ListContainerComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ListContainerComponent),
        TableModule,
        WidgetPanelModule,
        AngularSvgIconModule,
        SidebarWidgetModule
    ]
})
export class ListContainerModule {
}
