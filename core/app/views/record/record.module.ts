import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecordComponent} from './record.component';
import {FieldModule} from '@fields/field.module';
import {RecordContainerModule} from '@components/record-container/record-container.module';
import {RecordHeaderModule} from '@components/record-header/record-header.module';
import {StatusBarModule} from '@components/status-bar/status-bar.module';
import {RecordSettingsMenuModule} from '@components/record-settings-menu/record-settings-menu.module';

@NgModule({
    declarations: [RecordComponent],
    exports: [RecordComponent],
    imports: [
        CommonModule,
        FieldModule,
        RecordContainerModule,
        RecordHeaderModule,
        StatusBarModule,
        RecordSettingsMenuModule
    ],
})
export class RecordModule {
}
