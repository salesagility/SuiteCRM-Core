import {Component} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';

@Component({
    selector: 'scrm-url-detail',
    templateUrl: './url.component.html',
    styleUrls: []
})
export class UrlDetailFieldComponent extends BaseFieldComponent {

    get target(): string {
        if (this.metadata && this.metadata.target) {
            return this.metadata.target;
        }

        return '_blank';
    }
}
