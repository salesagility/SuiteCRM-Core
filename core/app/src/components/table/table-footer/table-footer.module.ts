import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {TableFooterComponent} from './table-footer.component';

import {PaginationModule} from '../../pagination/pagination.module';
import {BulkActionMenuModule} from '../../bulk-action-menu/bulk-action-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [TableFooterComponent],
    exports: [TableFooterComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(TableFooterComponent),
        PaginationModule,
        BulkActionMenuModule,
        AngularSvgIconModule
    ]
})
export class TableFooterModule {
}
