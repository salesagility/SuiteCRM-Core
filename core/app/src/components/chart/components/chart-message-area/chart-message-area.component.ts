import {Component, Input} from '@angular/core';
import {LanguageStore} from '@store/language/language.store';

@Component({
    selector: 'scrm-chart-message-area',
    templateUrl: './chart-message-area.component.html',
    styleUrls: []
})
export class ChartMessageAreaComponent {

    @Input() labelKey = '';

    constructor(public language: LanguageStore) {
    }
}
