import {Component} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-email-detail',
    templateUrl: './email.component.html',
    styleUrls: []
})
export class EmailDetailFieldsComponent extends BaseFieldComponent {

    constructor(protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }
}
