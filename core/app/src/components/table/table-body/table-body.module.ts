import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {TableBodyComponent} from './table-body.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {CdkTableModule} from '@angular/cdk/table';

@NgModule({
    declarations: [TableBodyComponent],
    exports: [TableBodyComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(TableBodyComponent),
        AngularSvgIconModule,
        CdkTableModule,
    ]
})
export class TablebodyUiModule {
}
