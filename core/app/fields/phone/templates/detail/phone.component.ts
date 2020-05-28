import {Component,} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';

@Component({
    selector: 'scrm-phone-detail',
    templateUrl: './phone.component.html',
    styleUrls: []
})
export class PhoneDetailFieldComponent extends BaseFieldComponent {

    getTelLink(phone: string): string {
        if (!phone) {
            return null;
        }
        return 'tel:' + this.getUnFormatted(phone);
    }

    getUnFormatted(phone: string): string {
        if (!phone) {
            return '';
        }
        return phone.replace(/\s+/g, '');
    }
}
