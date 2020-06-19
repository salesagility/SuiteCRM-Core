import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ListHeaderComponent} from './list-header.component';

import {ModuleTitleModule} from '../module-title/module-title.module';
import {ActionMenuModule} from '../action-menu/action-menu.module';
import {SettingsMenuModule} from '../settings-menu/settings-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ListFilterModule} from '@components/list-filter/list-filter.module';

@NgModule({
    declarations: [ListHeaderComponent],
    exports: [ListHeaderComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ListHeaderComponent),
        ModuleTitleModule,
        ActionMenuModule,
        SettingsMenuModule,
        AngularSvgIconModule,
        ListFilterModule
    ]
})
export class ListHeaderModule {
}
