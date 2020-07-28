import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FieldComponent} from './field.component';
import {DynamicModule} from 'ng-dynamic-component';
import {fieldComponents, fieldModules} from './field.manifest';
import {RouterModule} from '@angular/router';

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
        RouterModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FieldModule {
}
