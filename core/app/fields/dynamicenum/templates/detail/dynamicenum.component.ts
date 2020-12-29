import {Component} from '@angular/core';
import {BaseEnumComponent} from '@fields/base/base-enum.component';
import {LanguageStore} from '@store/language/language.store';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-dynamicenum-detail',
    templateUrl: './dynamicenum.component.html',
    styleUrls: []
})
export class DynamicEnumDetailFieldComponent extends BaseEnumComponent {
    constructor(protected languages: LanguageStore, protected typeFormatter: DataTypeFormatter) {
        super(languages, typeFormatter);
    }
}
