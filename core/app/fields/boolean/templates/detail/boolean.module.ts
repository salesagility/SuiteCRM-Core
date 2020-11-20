import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {BooleanDetailFieldComponent} from './boolean.component';

@NgModule({
    declarations: [BooleanDetailFieldComponent],
    exports: [BooleanDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(BooleanDetailFieldComponent),
    ]
})
export class BooleanDetailFieldModule {
}
