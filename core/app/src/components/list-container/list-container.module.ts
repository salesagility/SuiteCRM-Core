import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ListContainerComponent} from './list-container.component';

import {TableModule} from '../table/table.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ListChartModule} from '@components/list-chart/list-chart.module';
import {WidgetPanelModule} from '@components/widget-panel/widget-panel.module';

@NgModule({
    declarations: [ListContainerComponent],
    exports: [ListContainerComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ListContainerComponent),
        TableModule,
        WidgetPanelModule,
        AngularSvgIconModule,
        ListChartModule
    ]
})
export class ListContainerModule {
}
