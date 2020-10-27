import {StatisticsTopWidgetModule} from '@containers/top-widget/components/statistics-top-widget/statistics-top-widget.module';
import {StatisticsTopWidgetComponent} from '@containers/top-widget/components/statistics-top-widget/statistics-top-widget.component';

export const topWidgetModules = [
    StatisticsTopWidgetModule,
];

export const componentTypeMap = {
    statistics: StatisticsTopWidgetComponent,
};
