import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule, AppManifest} from '../../app-manager/app-manager.module';
import { FieldUiComponent } from './field.component';

const manifest: AppManifest[] = [];

@NgModule({
    declarations: [
        FieldUiComponent,
    ],
    exports: [
        FieldUiComponent,
    ],
    imports: [
        CommonModule,
        AppManagerModule.forRoot(manifest)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FieldModule {
}