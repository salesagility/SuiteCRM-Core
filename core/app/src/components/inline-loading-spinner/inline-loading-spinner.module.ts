import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InlineLoadingSpinnerComponent} from './inline-loading-spinner.component';


@NgModule({
    declarations: [InlineLoadingSpinnerComponent],
    exports: [InlineLoadingSpinnerComponent],
    imports: [
        CommonModule
    ]
})
export class InlineLoadingSpinnerModule {
}
