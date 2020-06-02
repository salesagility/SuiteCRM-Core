import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {UrlDetailFieldComponent} from '@fields/url/templates/detail/url.component';

@NgModule({
    declarations: [UrlDetailFieldComponent],
    exports: [UrlDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(UrlDetailFieldComponent),
    ]
})
export class UrlDetailFieldModule {
}
