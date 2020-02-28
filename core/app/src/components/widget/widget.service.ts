import {HostListener, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WidgetService {

  displayWidgets: boolean = true;
  widgetHeaderToggleIcon: string = "public/themes/suite8/images/minimise_circled.svg";
  listViewFullWidth: boolean = true;

  emitData() {
    this.displayWidgets = !this.displayWidgets;
    this.listViewFullWidth = !this.listViewFullWidth;
  }
  constructor() { }

}