import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'scrm-action-menu-ui',
  templateUrl: 'action-menu.component.html',

})

export class ActionmenuUiComponent implements OnInit {

  newButtonConfig = {
    text: 'NEW',
    buttonClass: 'action-button'
  };

  importButtonConfig = {
    text: 'IMPORT',
    buttonClass: 'action-button'
  };

  ngOnInit() {

  }

}
