import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {animate, transition, trigger} from '@angular/animations';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {
    AnyModalButtonInterface,
    ModalButtonGroupInterface,
    ModalCloseFeedBack
} from '@app-common/components/modal/modal.model';
import {Observable, of} from 'rxjs';


@Component({
    selector: 'scrm-message-modal',
    templateUrl: './message-modal.component.html',
    styleUrls: [],
    animations: [
        trigger('modalFade', [
            transition('void <=> *', [
                animate('800ms')
            ]),
        ]),
    ]
})
export class MessageModalComponent implements OnInit {

    @Input() titleKey: string;
    @Input() textKey: string;
    @Input() buttons: AnyModalButtonInterface[] = [];

    buttonGroup$: Observable<ModalButtonGroupInterface>;
    closeButton: ButtonInterface;

    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit(): void {

        this.buttonGroup$ = of({
            buttons: this.buttons
        } as ModalButtonGroupInterface);

        this.closeButton = {
            klass: ['btn', 'btn-outline-light', 'btn-sm'],
            onClick: (): void => {
                this.activeModal.close({
                    type: 'close-button'
                } as ModalCloseFeedBack);
            }
        } as ButtonInterface;

    }
}
