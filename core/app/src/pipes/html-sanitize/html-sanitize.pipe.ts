import {Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
    name: 'htmlSanitize'
})
export class HtmlSanitizePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {
    }

    transform(data): SafeHtml {
        return this.sanitizer.sanitize(SecurityContext.HTML, data);
    }
}
