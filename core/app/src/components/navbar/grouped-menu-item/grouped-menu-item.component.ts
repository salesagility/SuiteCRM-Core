import {Component, Input} from '@angular/core';
import {MenuItem} from '@components/navbar/navbar.abstract';
import {LanguageStrings} from '@store/language/language.store';

@Component({
    selector: 'scrm-grouped-menu-item',
    templateUrl: './grouped-menu-item.component.html',
    styleUrls: []
})
export class GroupedMenuItemComponent {
    @Input() item: MenuItem;
    @Input() languages: LanguageStrings;
    @Input() subNavCollapse: boolean;

    constructor() {
    }
}
