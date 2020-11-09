import {ChartSidebarWidgetModule} from '@containers/sidebar-widget/components/chart-sidebar-widget/chart-sidebar-widget.module';
import {ChartSidebarWidgetComponent} from '@containers/sidebar-widget/components/chart-sidebar-widget/chart-sidebar-widget.component';
import {HistorySidebarWidgetModule} from '@containers/sidebar-widget/components/history-sidebar-widget/history-sidebar-widget.module';
import {HistorySidebarWidgetComponent} from '@containers/sidebar-widget/components/history-sidebar-widget/history-sidebar-widget.component';

export const sidebarWidgetModules = [
    HistorySidebarWidgetModule,
    ChartSidebarWidgetModule
];

export const componentTypeMap = {
    'history-timeline': HistorySidebarWidgetComponent,
    chart: ChartSidebarWidgetComponent
};
