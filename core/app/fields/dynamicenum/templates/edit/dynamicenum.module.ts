import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule} from '@angular/forms';
import {TagInputModule} from 'ngx-chips';
import {DynamicEnumEditFieldComponent} from './dynamicenum.component';

@NgModule({
    declarations: [DynamicEnumEditFieldComponent],
    exports: [DynamicEnumEditFieldComponent],
    imports: [
        CommonModule,
        TagInputModule,
        FormsModule
    ]
})
export class DynamicEnumEditFieldModule {
}
