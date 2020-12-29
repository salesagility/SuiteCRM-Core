import {Component} from '@angular/core';
import {BaseEnumComponent} from '@fields/base/base-enum.component';
import {LanguageStore} from '@store/language/language.store';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-enum-detail',
    templateUrl: './enum.component.html',
    styleUrls: []
})
export class EnumDetailFieldComponent extends BaseEnumComponent {
    constructor(protected languages: LanguageStore, protected typeFormatter: DataTypeFormatter) {
        super(languages, typeFormatter);
    }
}
