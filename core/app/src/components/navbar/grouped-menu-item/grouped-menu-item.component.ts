import {Component, Input} from '@angular/core';
import {LanguageStrings} from '@store/language/language.store';
import {MenuItem} from '@app-common/menu/menu.model';

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
