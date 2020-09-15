import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '../../app-manager/app-manager.module';
import {RecordContainerComponent} from './record-container.component';
import {WidgetUiModule} from '../widget/widget.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {SubpanelModule} from '@components/subpanel/subpanel.module';
import {RecordContentModule} from '@components/record-content/record-content.module';

@NgModule({
    declarations: [RecordContainerComponent],
    exports: [RecordContainerComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(RecordContainerComponent),
        WidgetUiModule,
        AngularSvgIconModule,
        SubpanelModule,
        RecordContentModule
    ]
})
export class RecordContainerModule {
}
