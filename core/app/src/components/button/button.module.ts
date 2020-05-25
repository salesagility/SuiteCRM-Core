import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {ButtonComponent} from './button.component';

@NgModule({
    declarations: [ButtonComponent],
    exports: [ButtonComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ButtonComponent),
    ]
})
export class ButtonModule {
}