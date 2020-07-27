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

@NgModule({
    declarations: [ChartUiComponent],
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
        BrowserAnimationsModule
    ]
})
export class ChartUiModule {
}
