import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FieldGridComponent} from './field-grid.component';
import {ButtonModule} from '@components/button/button.module';
import {FieldModule} from '@fields/field.module';

@NgModule({
    declarations: [FieldGridComponent],
    exports: [
        FieldGridComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        FieldModule
    ]
})
export class FieldGridModule {
}
