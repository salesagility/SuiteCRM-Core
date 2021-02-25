import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FieldModule} from '../../../../fields/field.module';
import {RecordContainerModule} from '../../../record/components/record-container/record-container.module';
import {CreateRecordComponent} from './create-record.component';
import {RecordHeaderModule} from '../../../record/components/record-header/record-header.module';
import {RecordSettingsMenuModule} from '../../../record/components/record-settings-menu/record-settings-menu.module';
import {StatusBarModule} from '../../../../components/status-bar/status-bar.module';
import {RecordModule} from '../../../record/components/record-view/record.module';
import {SubpanelModule} from '../../../../containers/subpanel/components/subpanel/subpanel.module';

@NgModule({
    declarations: [CreateRecordComponent],
    exports: [CreateRecordComponent],
    imports: [
        CommonModule,
        FieldModule,
        RecordModule,
        RecordContainerModule,
        RecordHeaderModule,
        StatusBarModule,
        RecordSettingsMenuModule,
        SubpanelModule
    ],
})
export class CreateRecordModule {
}
