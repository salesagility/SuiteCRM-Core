import {Component} from '@angular/core';
import {BaseBooleanComponent} from '@fields/base/base-boolean.component';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-boolean-edit',
    templateUrl: './boolean.component.html',
    styleUrls: []
})
export class BooleanEditFieldComponent extends BaseBooleanComponent {
    constructor(protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }
}
