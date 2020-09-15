import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecordContentComponent} from '@components/record-content/record-content.component';
import {PanelModule} from '@components/panel/panel.module';


@NgModule({
    declarations: [
        RecordContentComponent
    ],
    exports: [
        RecordContentComponent
    ],
    imports: [
        CommonModule,
        PanelModule
    ]
})
export class RecordContentModule {
}
