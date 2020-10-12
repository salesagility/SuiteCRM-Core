import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ListContainerComponent} from './list-container.component';

import {TableModule} from '../table/table.module';
import {WidgetModule} from '../widget/widget.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ChartModule} from '@components/chart/chart.module';

@NgModule({
    declarations: [ListContainerComponent],
    exports: [ListContainerComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ListContainerComponent),
        TableModule,
        WidgetModule,
        AngularSvgIconModule,
        ChartModule
    ]
})
export class ListContainerModule {
}
