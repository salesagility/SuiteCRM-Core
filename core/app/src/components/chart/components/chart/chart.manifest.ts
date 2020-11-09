import {PieGridChartModule} from '@components/chart/components/pie-grid-chart/pie-grid-chart.module';
import {VerticalBarChartModule} from '@components/chart/components/vertical-bar-chart/vertical-bar-chart.module';
import {LineChartModule} from '@components/chart/components/line-chart/line-chart.module';
import {LineChartComponent} from '@components/chart/components/line-chart/line-chart.component';
import {PieGridChartComponent} from '@components/chart/components/pie-grid-chart/pie-grid-chart.component';
import {VerticalBarChartComponent} from '@components/chart/components/vertical-bar-chart/vertical-bar-chart.component';

export const chartModules = [
    LineChartModule,
    PieGridChartModule,
    VerticalBarChartModule
];

export const chartTypeMap = {
    'line-chart': LineChartComponent,
    'pie-grid': PieGridChartComponent,
    'vertical-bar': VerticalBarChartComponent
};
