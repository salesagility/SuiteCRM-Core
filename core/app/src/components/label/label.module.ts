import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabelComponent} from './label.component';

@NgModule({
    declarations: [LabelComponent],
    exports: [
        LabelComponent
    ],
    imports: [
        CommonModule
    ]
})
export class LabelModule {
}
