import {Component} from '@angular/core';
import {LanguageStore} from '@store/language/language.store';
import {BaseMultiEnumComponent} from '@fields/base/base-multienum.component';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-multienum-detail',
    templateUrl: './multienum.component.html',
    styleUrls: []
})
export class MultiEnumDetailFieldComponent extends BaseMultiEnumComponent {
    constructor(protected languages: LanguageStore, protected typeFormatter: DataTypeFormatter) {
        super(languages, typeFormatter);
    }
}
