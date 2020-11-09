import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarWidgetComponent} from './sidebar-widget.component';
import {DynamicModule} from 'ng-dynamic-component';
import {sidebarWidgetModules} from '@containers/sidebar-widget/components/sidebar-widget/sidebar-widget.manifest';

@NgModule({
    declarations: [SidebarWidgetComponent],
    exports: [SidebarWidgetComponent],
    imports: [
        CommonModule,
        ...sidebarWidgetModules,
        DynamicModule,
    ]
})
export class SidebarWidgetModule {
}
