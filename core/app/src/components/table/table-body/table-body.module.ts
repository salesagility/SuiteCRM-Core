import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {TableBodyComponent} from './table-body.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {CdkTableModule} from '@angular/cdk/table';
import {FieldModule} from '@fields/field.module';
import {SortButtonModule} from '@components/sort-button/sort-button.module';

@NgModule({
    declarations: [TableBodyComponent],
    exports: [TableBodyComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(TableBodyComponent),
        AngularSvgIconModule,
        CdkTableModule,
        FieldModule,
        SortButtonModule,
    ]
})
export class TablebodyUiModule {
}
