import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FieldComponent} from './field.component';
import {DynamicModule} from 'ng-dynamic-component';
import {fieldComponents, fieldModules} from './field.manifest';
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
        DynamicModule.withComponents(fieldComponents),
        DynamicFieldModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FieldModule {
}
