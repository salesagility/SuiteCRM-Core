import {Component} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';

@Component({
    selector: 'scrm-varchar-detail',
    templateUrl: './varchar.component.html',
    styleUrls: []
})
export class VarcharDetailFieldComponent extends BaseFieldComponent {
    link(): boolean {
        if (this.field.metadata && this.field.metadata.link) {
            return this.field.metadata.link;
        }
        return false;
    }
}
