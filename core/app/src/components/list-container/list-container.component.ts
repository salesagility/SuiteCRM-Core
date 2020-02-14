import {Component, HostListener, OnInit} from '@angular/core';
import {trigger, style, animate, transition} from "@angular/animations";

@Component({
  selector: 'scrm-list-container-ui',
  templateUrl: 'list-container.component.html',
  animations: [
    trigger("widgetFade", [
      transition("void => *", [
        style({transform: "translateX(100%)", opacity: 0}),
        animate("500ms", style({transform: "translateX(0)", opacity: 1}))
      ]),
      transition("* => void", [
        style({transform: "translateX(0)", opacity: 1}),
        animate("500ms", style({transform: "translateX(100%)", opacity: 0}))
      ])
    ]),
    trigger("widgetContentFade", [
      transition("void => *", [
        style({transform: "translateY(-5%)", opacity: 0}),
        animate("500ms", style({transform: "translateY(0)", opacity: 1}))
      ]),
      transition("* => void", [
        style({transform: "translateY(0)", opacity: 1}),
        animate("500ms", style({transform: "translateY(-5%)", opacity: 0}))
      ])
    ])
  ]

})

export class ListcontainerUiComponent implements OnInit {

  displayWidgets: boolean = true;
  displayWidgetContent: boolean = true;
  displayResponsiveTable: boolean = false;
  showCollapsed: boolean = false;
  widgetHeaderToggleIcon: string = "public/themes/suite8/images/minimise_circled.svg";
  tableToggleIcon: string = "public/themes/suite8/images/mobile_expand_icon.svg";
  listViewFullWidth: boolean = true;
  listViewIconUnsorted: string = "public/themes/suite8/images/sort.svg";
  listViewIconSorted: string = "public/themes/suite8/images/sort_descend.svg";

  orderBy: string = "date_entered";
  desc: string = "ASC";
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

  expandRow(row) {
    row.expanded = !row.expanded;
  }

  toggleWidgets() {
    this.displayWidgets = !this.displayWidgets;
    this.listViewFullWidth = !this.listViewFullWidth;
  }

  toggleWidgetContent() {
    if (this.widgetHeaderToggleIcon == "public/themes/suite8/images/minimise_circled.svg") {
      this.widgetHeaderToggleIcon = "public/themes/suite8/images/plus_thin.svg";
      this.displayWidgetContent = false;
    } else {
      this.widgetHeaderToggleIcon = "public/themes/suite8/images/minimise_circled.svg";
      this.displayWidgetContent = true;
    }
  }

  ngOnInit() {
    window.dispatchEvent(new Event("resize"));

  }

  // order(key: string) {
  //   if (this.orderBy == key) {
  //     this.desc = this.desc == "ASC" ? "DESC" : "ASC";
  //   } else {
  //     this.desc = "ASC";
  //   }
  //
  //   if (this.orderBy == key && this.desc == "DESC") {
  //     this.listViewIconSorted = "sort_ascend.svg";
  //   } else if (this.orderBy == key && this.desc == "ASC") {
  //     this.listViewIconSorted = "sort_descend.svg";
  //   }
  //
  //   this.orderBy = key;
  //
  // }

  selectAll() {
    this.allSelected = true;
  }

  deselectAll() {
    this.allSelected = false;
  }

}
