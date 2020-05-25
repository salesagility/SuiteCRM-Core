import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormatNumberPipe} from '@base/pipes/format-number/format-number.pipe';

@NgModule({
    declarations: [
        FormatNumberPipe
    ],
    exports: [
        FormatNumberPipe
    ],
    imports: [
        CommonModule,
    ]
})
export class FormatNumberModule {
}
