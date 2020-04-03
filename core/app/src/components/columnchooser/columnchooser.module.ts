import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {ColumnChooserUiComponent} from './columnchooser.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ImageModule} from '@components/image/image.module';

@NgModule({
    declarations: [ColumnChooserUiComponent],
    exports: [ColumnChooserUiComponent],
    imports: [
        CommonModule,
        DragDropModule,
        AppManagerModule.forChild(ColumnChooserUiComponent),
        ImageModule
    ]
})
export class ColumnchooserUiModule {
}
