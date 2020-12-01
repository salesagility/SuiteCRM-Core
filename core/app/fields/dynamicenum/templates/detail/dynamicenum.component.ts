import {Component} from '@angular/core';
import {BaseEnumComponent} from '@fields/base/base-enum.component';
import {LanguageStore} from '@store/language/language.store';

@Component({
    selector: 'scrm-dynamicenum-detail',
    templateUrl: './dynamicenum.component.html',
    styleUrls: []
})
export class DynamicEnumDetailFieldComponent extends BaseEnumComponent {
    constructor(protected languages: LanguageStore) {
        super(languages);
    }
}
