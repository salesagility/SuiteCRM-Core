import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {TextDetailFieldComponent} from './text.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [TextDetailFieldComponent],
    exports: [TextDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(TextDetailFieldComponent),
        FormsModule
    ]
})
export class TextDetailFieldModule {
}
