import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ListViewUiComponent} from './list-view.component';
import {ModalViewUiModule} from '../modal-view/modal-view.module';
import {FilterUiModule} from '../filter/filter.module';
import {ColumnchooserUiModule} from '../columnchooser/columnchooser.module';
import {FieldModule} from '../../../fields/field.module';
import {RouterModule} from '@angular/router';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [ListViewUiComponent],
    exports: [ListViewUiComponent],
    imports: [
        FieldModule,
        ModalViewUiModule,
        FilterUiModule,
        ColumnchooserUiModule,
        CommonModule,
        AppManagerModule.forChild(ListViewUiComponent),
        AngularSvgIconModule
    ]
})
export class ListViewUiModule {
}
