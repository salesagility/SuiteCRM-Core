import {Component, OnInit} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {
    trigger,
    animate,
    transition,
} from '@angular/animations';

@Component({
    selector: 'scrm-modal-view-ui',
    templateUrl: './modal-view.component.html',
    animations: [
        trigger('modalFade', [
            transition('void <=> *', [
                animate('800ms')
            ]),
        ]),
    ]
})

export class ModalViewUiComponent implements OnInit {
    closeResult: string;

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

    ngOnInit() {
    }

}
