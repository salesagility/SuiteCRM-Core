import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecordComponent} from './record.component';
import {FieldModule} from '@fields/field.module';

@NgModule({
    declarations: [RecordComponent],
    exports: [RecordComponent],
    imports: [
        CommonModule,
        FieldModule
    ],
})
export class RecordModule {
}
