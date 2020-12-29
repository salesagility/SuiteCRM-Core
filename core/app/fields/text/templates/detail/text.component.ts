import {Component} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-text-detail',
    templateUrl: './text.component.html',
    styleUrls: []
})
export class TextDetailFieldComponent extends BaseFieldComponent {

    constructor(protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }

    get rows(): number {
        if (this.field.metadata && this.field.metadata.rows) {
            return this.field.metadata.rows;
        }

        return 6;
    }

    get cols(): number {
        if (this.field.metadata && this.field.metadata.cols) {
            return this.field.metadata.cols;
        }

        return 20;
    }
}
