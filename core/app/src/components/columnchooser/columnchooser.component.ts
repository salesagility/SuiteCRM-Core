import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'scrm-columnchooser-ui',
  templateUrl: './columnchooser.component.html',
})

export class ColumnChooserUiComponent implements OnInit {

  modalTitle: string = 'Choose Columns';
  closeResult: string;

  constructor(private modalService: NgbModal) {
  }

  open(modal) {
    this.modalService.open(modal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'lg',
      windowClass: 'column-chooser-modal'
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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  ngOnInit() {

  }

}
