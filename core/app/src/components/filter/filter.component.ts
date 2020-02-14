import {Component, OnInit} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

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
