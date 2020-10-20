import {Component} from '@angular/core';
import {BaseEnumComponent} from '@fields/base/base-enum.component';
import {LanguageStore} from '@store/language/language.store';

@Component({
    selector: 'scrm-enum-detail',
    templateUrl: './enum.component.html',
    styleUrls: []
})
export class EnumDetailFieldComponent extends BaseEnumComponent {
    constructor(protected languages: LanguageStore) {
        super(languages);
    }
}
