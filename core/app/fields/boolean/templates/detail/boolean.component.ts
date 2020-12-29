import {Component} from '@angular/core';
import {BaseBooleanComponent} from '@fields/base/base-boolean.component';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-boolean-detail',
    templateUrl: './boolean.component.html',
    styleUrls: []
})
export class BooleanDetailFieldComponent extends BaseBooleanComponent {
    constructor(protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }
}
