import {Component, Input} from '@angular/core';

@Component({
    selector: 'scrm-home-menu-item',
    templateUrl: './home-menu-item.component.html',
    styleUrls: []
})
export class HomeMenuItemComponent {
    @Input() route: string;
    @Input() active: boolean;

    constructor() {
    }

}
