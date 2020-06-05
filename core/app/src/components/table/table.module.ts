import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {TableUiComponent} from './table.component';

import {TableheaderUiModule} from './table-header/table-header.module';
import {TablebodyUiModule} from './table-body/table-body.module';
import {TablefooterUiModule} from './table-footer/table-footer.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [TableUiComponent],
    exports: [TableUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(TableUiComponent),
        TableheaderUiModule,
        TablebodyUiModule,
        TablefooterUiModule,
        AngularSvgIconModule
    ]
})
export class TableUiModule {
}
