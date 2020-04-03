import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {PaginationUiComponent} from './pagination.component';
import {ImageModule} from '@components/image/image.module';

@NgModule({
    declarations: [PaginationUiComponent],
    exports: [PaginationUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(PaginationUiComponent),
        ImageModule
    ]
})
export class PaginationUiModule {
}
