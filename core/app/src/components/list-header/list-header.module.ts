import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ListHeaderComponent} from './list-header.component';

import {ModuleTitleModule} from '../module-title/module-title.module';
import {ActionmenuUiModule} from '../action-menu/action-menu.module';
import {SettingsmenuUiModule} from '../settings-menu/settings-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    declarations: [ListHeaderComponent],
    exports: [ListHeaderComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ListHeaderComponent),
        ModuleTitleModule,
        ActionmenuUiModule,
        SettingsmenuUiModule,
        AngularSvgIconModule
    ]
})
export class ListHeaderModule {
}
