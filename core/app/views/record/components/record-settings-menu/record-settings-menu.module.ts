import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {RecordSettingsMenuComponent} from './record-settings-menu.component';
import {ImageModule} from '@components/image/image.module';
import {ButtonModule} from '@components/button/button.module';
import {ButtonGroupModule} from '@components/button-group/button-group.module';

@NgModule({
    declarations: [RecordSettingsMenuComponent],
    exports: [RecordSettingsMenuComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(RecordSettingsMenuComponent),
        ImageModule,
        ButtonModule,
        ButtonGroupModule
    ]
})
export class RecordSettingsMenuModule {
}
