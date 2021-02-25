import {HistorySidebarWidgetComponent} from '../history-sidebar-widget/history-sidebar-widget.component';
import {StatisticsSidebarWidgetModule} from '../statistics-sidebar-widget/statistics-sidebar-widget.module';
import {HistorySidebarWidgetModule} from '../history-sidebar-widget/history-sidebar-widget.module';
import {StatisticsSidebarWidgetComponent} from '../statistics-sidebar-widget/statistics-sidebar-widget.component';
import {ChartSidebarWidgetModule} from '../chart-sidebar-widget/chart-sidebar-widget.module';
import {ChartSidebarWidgetComponent} from '../chart-sidebar-widget/chart-sidebar-widget.component';

export const sidebarWidgetModules = [
    HistorySidebarWidgetModule,
    ChartSidebarWidgetModule,
    StatisticsSidebarWidgetModule
];

export const componentTypeMap = {
    'history-timeline': HistorySidebarWidgetComponent,
    chart: ChartSidebarWidgetComponent,
    statistics: StatisticsSidebarWidgetComponent
};
