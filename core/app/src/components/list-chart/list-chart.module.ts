import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ListChartComponent} from './list-chart.component';
import {ImageModule} from '@components/image/image.module';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FullPageSpinnerModule} from '@components/full-page-spinner/full-page-spinner.module';
import {VerticalBarChartModule} from '@components/chart/components/vertical-bar-chart/vertical-bar-chart.module';
import {LineChartModule} from '@components/chart/components/line-chart/line-chart.module';
import {PieGridChartModule} from '@components/chart/components/pie-grid-chart/pie-grid-chart.module';

@NgModule({
    declarations: [ListChartComponent],
    exports: [ListChartComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ListChartComponent),
        ImageModule,
        DropdownButtonModule,
        NgbDropdownModule,
        BrowserModule,
        FormsModule,
        NgxChartsModule,
        BrowserAnimationsModule,
        FullPageSpinnerModule,
        VerticalBarChartModule,
        LineChartModule,
        PieGridChartModule
    ]
})
export class ListChartModule {
}
