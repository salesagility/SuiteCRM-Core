import {Component, Input} from '@angular/core';
import {LanguageStore} from '@store/language/language.store';

@Component({
    selector: 'scrm-label',
    templateUrl: './label.component.html',
    styleUrls: []
})
export class LabelComponent {

    @Input() labelKey = '';
    @Input() module: string = null;
    @Input() listKey: string = null;

    languages$ = this.language.vm$;

    constructor(public language: LanguageStore) {
    }

}
