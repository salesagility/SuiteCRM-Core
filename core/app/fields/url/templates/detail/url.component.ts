import {Component} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';

@Component({
    selector: 'scrm-url-detail',
    templateUrl: './url.component.html',
    styleUrls: []
})
export class UrlDetailFieldComponent extends BaseFieldComponent {

    get target(): string {
        if (this.field.metadata && this.field.metadata.target) {
            return this.field.metadata.target;
        }

        return '_blank';
    }
}
