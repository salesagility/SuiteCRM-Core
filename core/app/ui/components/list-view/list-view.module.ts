import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../../../app-manager/app-manager.module';
import {ListViewUiComponent} from './list-view.component';
import {SvgIconUiModule} from '../svg-icon/svg-icon.module';
import {ModalViewUiModule} from '../modal-view/modal-view.module';
import {FieldModule} from '../../../fields/field.module';

@NgModule({
    declarations: [ListViewUiComponent],
    exports: [ListViewUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ListViewUiComponent),
        SvgIconUiModule,
        FieldModule,
        ModalViewUiModule
    ]
})
export class ListViewUiModule {
}