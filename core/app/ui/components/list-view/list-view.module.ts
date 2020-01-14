import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../../../app-manager/app-manager.module';
import {ListViewUiComponent} from './list-view.component';
import {SvgIconUiModule} from '../svg-icon/svg-icon.module';
import {ModalViewUiModule} from '../modal-view/modal-view.module';
import {FieldModule} from '../../../fields/field.module';
import {RouterModule} from '@angular/router';
import {ListViewUiRoutes} from '../list-view/list-view.routes';

@NgModule({
    declarations: [ListViewUiComponent],
    exports: [ListViewUiComponent],
    imports: [
        SvgIconUiModule,
        FieldModule,
        ModalViewUiModule,
        CommonModule,
        AppManagerModule.forChild(ListViewUiComponent)
    ]
})
export class ListViewUiModule {
}