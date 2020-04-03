import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {FilterUiComponent} from './filter.component';
import {ImageModule} from '@components/image/image.module';

@NgModule({
    declarations: [FilterUiComponent],
    exports: [FilterUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(FilterUiComponent),
        ImageModule
    ]
})
export class FilterUiModule {
}
