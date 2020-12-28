import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicLabelComponent} from './dynamic-label.component';


@NgModule({
    declarations: [DynamicLabelComponent],
    exports: [
        DynamicLabelComponent
    ],
    imports: [
        CommonModule
    ]
})
export class DynamicLabelModule {
}
