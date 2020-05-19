import {Component, HostListener, OnInit} from '@angular/core';
import {WidgetService} from '../widget/widget.service';

@Component({
    selector: 'scrm-list-container-ui',
    templateUrl: 'list-container.component.html'

})

export class ListcontainerUiComponent implements OnInit {

    displayResponsiveTable = false;
    showCollapsed = false;
    tableToggleIcon = 'public/themes/suite8/images/mobile_expand_icon.svg';
    listViewIconUnsorted = 'public/themes/suite8/images/sort.svg';
    listViewIconSorted = 'public/themes/suite8/images/sort_descend.svg';

    allSelected = false;

    constructor(public widgetService: WidgetService) {
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        const innerWidth = event.target.innerWidth;
        this.displayResponsiveTable = innerWidth <= 768;
    }

    toggleWidgets(): void {
        this.widgetService.emitData();
    }

    expandRow(row): void {
        row.expanded = !row.expanded;
    }

    ngOnInit(): void {
        window.dispatchEvent(new Event('resize'));
    }

    selectAll(): void {
        this.allSelected = true;
    }

    deselectAll(): void {
        this.allSelected = false;
    }
}
