import {Component, OnInit} from '@angular/core';

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '@services/auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'scrm-footer-ui',
    templateUrl: './footer.component.html',
    styleUrls: []
})
export class FooterUiComponent implements OnInit {

    private authSub: Subscription;

    closeResult: string;
    isUserLoggedIn: boolean;

    constructor(
        private modalService: NgbModal,
        private authService: AuthService
    ) {
    }

    openSugarCopyright(sugarcopyright) {
        this.modalService.open(sugarcopyright, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            size: 'lg'
        }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    openSuiteCopyright(suitecopyright) {
        this.modalService.open(suitecopyright, {
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

    backToTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    ngOnInit() {
        this.authSub = this.authService.isUserLoggedIn.subscribe(value => {
            this.isUserLoggedIn = value;
        });
    }

    ngOnDestroy() {
        this.authSub.unsubscribe();
    }
}
