import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {PaginationComponent} from './pagination.component';
import {ImageModule} from '@components/image/image.module';

@NgModule({
    declarations: [PaginationComponent],
    exports: [PaginationComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(PaginationComponent),
        ImageModule
    ]
})
export class PaginationModule {
}
