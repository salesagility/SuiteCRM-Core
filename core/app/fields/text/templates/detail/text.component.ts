import {Component} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';

@Component({
    selector: 'scrm-text-detail',
    templateUrl: './text.component.html',
    styleUrls: []
})
export class TextDetailFieldComponent extends BaseFieldComponent {
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
