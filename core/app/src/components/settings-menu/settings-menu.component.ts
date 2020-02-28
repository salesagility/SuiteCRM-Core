import {Component, OnInit} from '@angular/core';
import { WidgetService } from '../widget/widget.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'scrm-settings-menu-ui',
  templateUrl: 'settings-menu.component.html',

})

export class SettingsmenuUiComponent implements OnInit {

  constructor(private widgetService: WidgetService) {}

  toggleWidgets() {
    this.widgetService.emitData();
  }



  ngOnInit() {

  }

}
