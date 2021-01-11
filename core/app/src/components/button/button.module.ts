import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {ButtonComponent} from './button.component';
import {ImageModule} from '@components/image/image.module';
import {LabelModule} from '@components/label/label.module';

@NgModule({
    declarations: [ButtonComponent],
    exports: [ButtonComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ButtonComponent),
        ImageModule,
        LabelModule,
    ]
})
export class ButtonModule {
}
