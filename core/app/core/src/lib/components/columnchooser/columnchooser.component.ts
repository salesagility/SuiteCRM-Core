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
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ButtonInterface, ModalCloseFeedBack} from 'common';

@Component({
    selector: 'scrm-columnchooser',
    templateUrl: './columnchooser.component.html',
})

export class ColumnChooserComponent implements OnInit {
    close: ButtonInterface;

    modalTitle = 'Choose Columns';

    displayed = [
        'Name',
        'City',
        'Billing Country',
        'Phone',
        'User',
        'Email Address',
        'Date Created',
    ];

    hidden = [
        'Annual Revenue',
        'Phone Fax',
        'Billing Street',
        'Billing Post Code',
        'Shipping Street',
        'Shipping Postcode',
        'Rating',
        'Website',
        'Ownership',
        'Employees'
    ];

    constructor(public modal: NgbActiveModal) {
    }


    drop(event: CdkDragDrop<string[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }

    ngOnInit(): void {
        this.close = {
            klass: ['btn', 'btn-outline-light', 'btn-sm'],
            onClick: (): void => {
                this.modal.close({
                    type: 'close-button'
                } as ModalCloseFeedBack);
            }
        } as ButtonInterface;
    }

}
