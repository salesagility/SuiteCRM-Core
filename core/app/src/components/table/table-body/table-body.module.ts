import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {TablebodyUiComponent} from './table-body.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {CdkTableModule} from '@angular/cdk/table';

@NgModule({
    declarations: [TablebodyUiComponent],
    exports: [TablebodyUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(TablebodyUiComponent),
        AngularSvgIconModule,
        CdkTableModule,
    ]
})
export class TablebodyUiModule {
}
