import {Component, Input} from '@angular/core';
import {ButtonInterface} from '@app-common/components/button/button.model';

@Component({
    selector: 'scrm-modal',
    templateUrl: './modal.component.html',
    styleUrls: [],
})
export class ModalComponent {

    @Input() klass = '';
    @Input() headerKlass = '';
    @Input() bodyKlass = '';
    @Input() footerKlass = '';
    @Input() titleKey = '';
    @Input() closable = false;
    @Input() close: ButtonInterface = {
        klass: ['btn', 'btn-outline-light', 'btn-sm']
    } as ButtonInterface;

}
