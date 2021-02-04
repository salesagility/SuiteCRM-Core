import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FieldComponent} from './field.component';
import {fieldModules} from './field.manifest';
import {DynamicFieldModule} from '@fields/dynamic-field/dynamic-field.module';

@NgModule({
    declarations: [
        FieldComponent,
    ],
    exports: [
        FieldComponent,
    ],
    imports: [
        ...fieldModules,
        CommonModule,
        DynamicFieldModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FieldModule {
}
