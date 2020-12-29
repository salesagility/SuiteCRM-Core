import {Component} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-url-detail',
    templateUrl: './url.component.html',
    styleUrls: []
})
export class UrlDetailFieldComponent extends BaseFieldComponent {

    constructor(protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }

    get target(): string {
        if (this.field.metadata && this.field.metadata.target) {
            return this.field.metadata.target;
        }

        return '_blank';
    }
}
