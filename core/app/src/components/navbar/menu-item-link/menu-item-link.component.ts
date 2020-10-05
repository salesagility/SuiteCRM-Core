import {Component, Input} from '@angular/core';
import {MenuItemLink} from '@app-common/menu/menu.model';

@Component({
    selector: 'scrm-menu-item-link',
    templateUrl: './menu-item-link.component.html',
    styleUrls: []
})
export class MenuItemLinkComponent {
    @Input() link: MenuItemLink;
    @Input() icon: string;
    @Input() class: string;
    constructor() {
    }
}
