import {Component, Input} from '@angular/core';
import {MenuItem} from '@app-common/menu/menu.model';

@Component({
    selector: 'scrm-menu-items-list',
    templateUrl: './menu-items-list.component.html',
    styleUrls: []
})
export class MenuItemsListComponent {
    @Input() items: MenuItem[];
    @Input() label: string;

    constructor() {
    }
}
