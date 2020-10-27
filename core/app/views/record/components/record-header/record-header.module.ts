import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {RecordHeaderComponent} from './record-header.component';
import {ModuleTitleModule} from '@components/module-title/module-title.module';
import {RecordSettingsMenuModule} from '@views/record/components/record-settings-menu/record-settings-menu.module';

@NgModule({
    declarations: [RecordHeaderComponent],
    exports: [RecordHeaderComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(RecordHeaderComponent),
        ModuleTitleModule,
        RecordSettingsMenuModule
    ]
})
export class RecordHeaderModule {
}
