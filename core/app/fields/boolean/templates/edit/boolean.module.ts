import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {BooleanEditFieldComponent} from './boolean.component';

@NgModule({
    declarations: [BooleanEditFieldComponent],
    exports: [BooleanEditFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(BooleanEditFieldComponent),
    ]
})
export class BooleanEditFieldModule {
}
