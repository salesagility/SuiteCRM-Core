import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {TableComponent} from './table.component';

import {TableHeaderModule} from './table-header/table-header.module';
import {TableBodyModule} from './table-body/table-body.module';
import {TableFooterModule} from './table-footer/table-footer.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [TableComponent],
    exports: [TableComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(TableComponent),
        TableHeaderModule,
        TableBodyModule,
        TableFooterModule,
        AngularSvgIconModule
    ]
})
export class TableModule {
}
