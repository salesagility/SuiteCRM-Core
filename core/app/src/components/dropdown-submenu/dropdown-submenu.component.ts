import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AnyButtonInterface, DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';

@Component({
    selector: 'scrm-dropdown-submenu',
    templateUrl: './dropdown-submenu.component.html',
    styles: []
})
export class DropdownSubmenuComponent implements OnInit {
    @Input() item: DropdownButtonInterface;
    @Output('item-clicked') itemClicked = new EventEmitter<boolean>();
    isCollapsed = true;

    constructor() {
    }

    ngOnInit(): void {
    }

    click(item: AnyButtonInterface): void {

        if (item && item.onClick) {
            item.onClick();
        }

        this.itemClicked.emit(true);
    }
}
