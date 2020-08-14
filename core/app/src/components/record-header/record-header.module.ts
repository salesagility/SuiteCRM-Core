import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '../../app-manager/app-manager.module';
import {RecordHeaderComponent} from './record-header.component';
import {ModuleTitleModule} from '../module-title/module-title.module';
import {ActionMenuModule} from '../action-menu/action-menu.module';
import {SettingsMenuModule} from '../settings-menu/settings-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {RecordSettingsMenuModule} from '@components/record-settings-menu/record-settings-menu.module';

@NgModule({
    declarations: [RecordHeaderComponent],
    exports: [RecordHeaderComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(RecordHeaderComponent),
        ModuleTitleModule,
        ActionMenuModule,
        SettingsMenuModule,
        AngularSvgIconModule,
        RecordSettingsMenuModule
    ]
})
export class RecordHeaderModule {
}
