import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {SettingsmenuUiComponent} from './settings-menu.component';

import {ColumnchooserUiModule} from '../columnchooser/columnchooser.module';
import {FilterUiModule} from '../filter/filter.module';
import {ImageModule} from '@components/image/image.module';

@NgModule({
    declarations: [SettingsmenuUiComponent],
    exports: [SettingsmenuUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(SettingsmenuUiComponent),
        ColumnchooserUiModule,
        FilterUiModule,
        ImageModule
    ]
})
export class SettingsmenuUiModule {
}
