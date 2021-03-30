import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule, AppManifest} from '../../app-manager/app-manager.module';
import {FieldComponent} from './field.component';

const manifest: AppManifest[] = [];

@NgModule({
    declarations: [
        FieldComponent,
    ],
    exports: [
        FieldComponent,
    ],
    imports: [
        CommonModule,
        AppManagerModule.forRoot(manifest)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FieldModule {
}