import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {FooterUiComponent} from './footer.component';
import {ImageModule} from '@components/image/image.module';


@NgModule({
    declarations: [FooterUiComponent],
    exports: [FooterUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(FooterUiComponent),
        ImageModule
    ]
})
export class FooterUiModule {
}
