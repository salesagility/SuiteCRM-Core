import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonLoadingDirective} from '@base/directives/button-loading/button-loading.directive';

@NgModule({
    declarations: [
        ButtonLoadingDirective
    ],
    exports: [
        ButtonLoadingDirective
    ],
    imports: [
        CommonModule,
    ]
})
export class ButtonLoadingUiModule {
}
