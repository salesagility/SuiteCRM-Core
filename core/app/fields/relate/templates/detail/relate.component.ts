import {Component} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-relate-detail',
    templateUrl: './relate.component.html',
    styleUrls: []
})
export class RelateDetailFieldsComponent extends BaseFieldComponent {

    constructor(protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }
}
