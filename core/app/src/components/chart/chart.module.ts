import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ChartUiComponent} from './chart.component';
import {ImageModule} from '@components/image/image.module';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {VerticalBarChartComponent} from './charts/vertical-bar-chart/vertical-bar-chart.component';
import {LineChartComponent} from '@components/chart/charts/line-chart/line-chart.component';
import {PieGridChartComponent} from './charts/pie-grid-chart/pie-grid-chart.component';
import {FullPageSpinnerModule} from '@components/full-page-spinner/full-page-spinner.module';

@NgModule({
    declarations: [ChartUiComponent, VerticalBarChartComponent, LineChartComponent, PieGridChartComponent],
    exports: [ChartUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ChartUiComponent),
        ImageModule,
        DropdownButtonModule,
        NgbDropdownModule,
        BrowserModule,
        FormsModule,
        NgxChartsModule,
        BrowserAnimationsModule,
        FullPageSpinnerModule
    ]
})
export class ChartUiModule {
}
