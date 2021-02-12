/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

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
