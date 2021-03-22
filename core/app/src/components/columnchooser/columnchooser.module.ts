import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {ColumnChooserComponent} from './columnchooser.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ImageModule} from '@components/image/image.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CloseButtonModule } from '../close-button/close-button.module';

@NgModule({
    declarations: [ColumnChooserComponent],
    exports: [ColumnChooserComponent],
    imports: [
        CommonModule,
        DragDropModule,
        AppManagerModule.forChild(ColumnChooserComponent),
        ImageModule,
        NgbModule,
        CloseButtonModule
    ],
    entryComponents: [ColumnChooserComponent]
})
export class ColumnChooserModule {
}
