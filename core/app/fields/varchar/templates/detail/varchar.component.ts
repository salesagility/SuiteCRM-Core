import {Component} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-varchar-detail',
    templateUrl: './varchar.component.html',
    styleUrls: []
})
export class VarcharDetailFieldComponent extends BaseFieldComponent {
    constructor(protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }
}
