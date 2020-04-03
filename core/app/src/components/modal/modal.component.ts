import {Component, OnInit} from '@angular/core';

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {animate, transition, trigger,} from '@angular/animations';

@Component({
    selector: 'scrm-modal-ui',
    templateUrl: './modal.component.html',
    animations: [
        trigger('modalFade', [
            transition('void <=> *', [
                animate('800ms')
            ]),
        ]),
    ]
})

export class ModalUiComponent implements OnInit {
    closeResult: string;
    modalTitle: string = 'New Account';
    createModal: boolean = true;

    constructor(private modalService: NgbModal) {
    }

    open(modal) {
        this.modalService.open(modal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            size: 'lg'
        }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    newButtonConfig = {
        text: 'NEW',
        buttonClass: 'action-button'
    };

    ngOnInit() {
    }

}
