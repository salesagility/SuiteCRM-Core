import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecordComponent} from './record.component';
import {FieldModule} from '../../../../fields/field.module';
import {RecordContainerModule} from '../record-container/record-container.module';
import {RecordHeaderModule} from '../record-header/record-header.module';
import {RecordSettingsMenuModule} from '../record-settings-menu/record-settings-menu.module';
import {StatusBarModule} from '../../../../components/status-bar/status-bar.module';
import {SubpanelModule} from '../../../../containers/subpanel/components/subpanel/subpanel.module';

@NgModule({
    declarations: [RecordComponent],
    exports: [RecordComponent],
    imports: [
        CommonModule,
        FieldModule,
        RecordContainerModule,
        RecordHeaderModule,
        StatusBarModule,
        RecordSettingsMenuModule,
        SubpanelModule
    ],
})
export class RecordModule {
}
