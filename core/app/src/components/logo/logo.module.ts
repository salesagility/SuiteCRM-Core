import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {LogoUiComponent} from './logo.component';
import {ImageModule} from '@components/image/image.module';

@NgModule({
    declarations: [LogoUiComponent],
    exports: [LogoUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(LogoUiComponent),
        ImageModule
    ]
})
export class LogoUiModule {
}
