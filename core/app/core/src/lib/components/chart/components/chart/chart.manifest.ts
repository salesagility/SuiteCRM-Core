import {PieGridChartComponent} from '../pie-grid-chart/pie-grid-chart.component';
import {VerticalBarChartModule} from '../vertical-bar-chart/vertical-bar-chart.module';
import {VerticalBarChartComponent} from '../vertical-bar-chart/vertical-bar-chart.component';
import {PieGridChartModule} from '../pie-grid-chart/pie-grid-chart.module';
import {LineChartModule} from '../line-chart/line-chart.module';
import {LineChartComponent} from '../line-chart/line-chart.component';

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
