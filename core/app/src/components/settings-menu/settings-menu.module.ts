import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {SettingsMenuComponent} from './settings-menu.component';

import {ColumnchooserUiModule} from '../columnchooser/columnchooser.module';
import {ImageModule} from '@components/image/image.module';
import {ButtonModule} from '@components/button/button.module';

@NgModule({
    declarations: [SettingsMenuComponent],
    exports: [SettingsMenuComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(SettingsMenuComponent),
        ColumnchooserUiModule,
        ImageModule,
        ButtonModule
    ]
})
export class SettingsMenuModule {
}
