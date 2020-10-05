import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ListContainerComponent} from './list-container.component';

import {TableModule} from '../table/table.module';
import {WidgetUiModule} from '../widget/widget.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [ListContainerComponent],
    exports: [ListContainerComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ListContainerComponent),
        TableModule,
        WidgetUiModule,
        AngularSvgIconModule
    ]
})
export class ListContainerModule {
}
