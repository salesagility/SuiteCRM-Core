import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FieldLayoutComponent} from './field-layout.component';
import {FieldModule} from '@fields/field.module';
import {FieldGridModule} from '@components/field-grid/field-grid.module';
import {ImageModule} from '@components/image/image.module';


@NgModule({
    declarations: [FieldLayoutComponent],
    exports: [
        FieldLayoutComponent
    ],
    imports: [
        CommonModule,
        FieldModule,
        FieldGridModule,
        ImageModule
    ]
})
export class FieldLayoutModule {
}
