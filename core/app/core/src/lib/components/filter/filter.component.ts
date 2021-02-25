/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Component, OnInit} from '@angular/core';

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'scrm-filter-ui',
    templateUrl: './filter.component.html',

})

export class FilterUiComponent implements OnInit {

    filterModal: boolean = true;
    modalTitle: string = 'Quick Filter';
    closeResult: string;
    quickFilter: boolean = true;
    advancedFilter: boolean = false;

    constructor(private modalService: NgbModal) {
    }

    toggleQuickFilter() {
        this.modalTitle = 'Quick Filter';
        this.advancedFilter = !this.advancedFilter;
        this.quickFilter = !this.quickFilter;
    }

    toggleAdvancedFilter() {
        this.modalTitle = 'Advanced Filter';
        this.advancedFilter = !this.advancedFilter;
        this.quickFilter = !this.quickFilter;
    }

    open(modal) {
        this.modalService.open(modal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            size: 'lg',
            windowClass: 'filter-modal'
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
