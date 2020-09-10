import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HtmlSanitizePipe} from '@base/pipes/html-sanitize/html-sanitize.pipe';


@NgModule({
    declarations: [
        HtmlSanitizePipe
    ],
    exports: [
        HtmlSanitizePipe
    ],
    imports: [
        CommonModule
    ]
})
export class HtmlSanitizeModule {
}
