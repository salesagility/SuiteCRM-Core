import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {WidgetService} from '../widget/widget.service';

@Component({
  selector: 'scrm-list-container-ui',
  templateUrl: 'list-container.component.html'

})

export class ListcontainerUiComponent implements OnInit {

  displayResponsiveTable: boolean = false;
  showCollapsed: boolean = false;
  tableToggleIcon: string = "public/themes/suite8/images/mobile_expand_icon.svg";
  listViewIconUnsorted: string = "public/themes/suite8/images/sort.svg";
  listViewIconSorted: string = "public/themes/suite8/images/sort_descend.svg";

  allSelected: boolean = false;

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    event.target.innerWidth;
    if (innerWidth <= 768) {
      this.displayResponsiveTable = true;
    } else {
      this.displayResponsiveTable = false;
    }
  }

  constructor(private widgetService: WidgetService) {
  }

  toggleWidgets() {
    this.widgetService.emitData();
  }

  expandRow(row) {
    row.expanded = !row.expanded;
  }

  ngOnInit() {
    window.dispatchEvent(new Event("resize"));

  }

  selectAll() {
    this.allSelected = true;
  }

  deselectAll() {
    this.allSelected = false;
  }


}
