import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecordContentComponent} from '@components/record-content/record-content.component';
import {PanelModule} from '@components/panel/panel.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FieldLayoutModule} from '@components/field-layout/field-layout.module';


@NgModule({
    declarations: [
        RecordContentComponent
    ],
    exports: [
        RecordContentComponent
    ],
    imports: [
        CommonModule,
        PanelModule,
        NgbModule,
        FieldLayoutModule
    ]
})
export class RecordContentModule {
}
