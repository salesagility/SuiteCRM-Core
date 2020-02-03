import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ColumnChooserUiComponent} from './columnchooser.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [ColumnChooserUiComponent],
    exports: [ColumnChooserUiComponent],
    imports: [
        CommonModule,
        DragDropModule,
        AppManagerModule.forChild(ColumnChooserUiComponent),
        AngularSvgIconModule
    ]
})
export class ColumnchooserUiModule {
}