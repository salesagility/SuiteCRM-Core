import {HttpClient} from "@angular/common/http";
import {Component, OnInit, Input, HostListener} from "@angular/core";
import {ListViewData, ListViewDataModel} from "./list-view-data-model";
import {ApiService} from "../../services/api/api.service";
import {trigger, style, animate, transition} from "@angular/animations";

@Component({
    selector: "scrm-list-view-ui",
    templateUrl: "./list-view.component.html",
    styleUrls: [],
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
export class ListViewUiComponent implements OnInit {
    listViewData: ListViewData = new ListViewData();

    @Input() set module(module: string) {
        this.listViewData.module = module;
    }

    displayWidgets: boolean = true;
    displayWidgetContent: boolean = true;
    displayResponsiveTable: boolean = false;
    showCollapsed: boolean = false;
    widgetHeaderToggleIcon: string = "minimise_circled.svg";
    tableToggleIcon: string = "mobile_expand_icon.svg";
    listViewFullWidth: boolean = true;
    listViewIconUnsorted: string = "sort.svg";
    listViewIconSorted: string = "sort_descend.svg";

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
        if (this.widgetHeaderToggleIcon == "minimise_circled.svg") {
            this.widgetHeaderToggleIcon = "plus_thin.svg";
            this.displayWidgetContent = false;
        } else {
            this.widgetHeaderToggleIcon = "minimise_circled.svg";
            this.displayWidgetContent = true;
        }
    }

    constructor(protected api: ApiService, protected http: HttpClient) {
    }

    ngOnInit() {
        window.dispatchEvent(new Event("resize"));

        // const options: LegacyEntryUrlOptionsModel = {};
        // this.http.get(this.legacyApi.getLegacyEntryUrl(options));
        // this.loadList();
    }

    loadList() {
        this.api.getListViewData(
            this.listViewData,
            (listViewData: ListViewData) => {
                this.listViewData = listViewData;
            },
            this.orderBy,
            this.desc
        );
    }

    order(key: string) {
        if (this.orderBy == key) {
            this.desc = this.desc == "ASC" ? "DESC" : "ASC";
        } else {
            this.desc = "ASC";
        }

        if (this.orderBy == key && this.desc == "DESC") {
            this.listViewIconSorted = "sort_ascend.svg";
        } else if (this.orderBy == key && this.desc == "ASC") {
            this.listViewIconSorted = "sort_descend.svg";
        }

        this.orderBy = key;

        this.loadList();
    }

    selectAll() {
        this.allSelected = true;
    }

    deselectAll() {
        this.allSelected = false;
    }
}
