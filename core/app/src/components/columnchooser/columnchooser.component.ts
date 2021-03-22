import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ButtonInterface } from '@base/app-common/components/button/button.model';
import { ModalCloseFeedBack } from '@base/app-common/components/modal/modal.model';

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
