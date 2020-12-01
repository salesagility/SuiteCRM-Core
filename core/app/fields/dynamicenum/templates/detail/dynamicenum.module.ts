import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DynamicEnumDetailFieldComponent} from './dynamicenum.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [DynamicEnumDetailFieldComponent],
    exports: [DynamicEnumDetailFieldComponent],
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class DynamicEnumDetailFieldModule {
}
