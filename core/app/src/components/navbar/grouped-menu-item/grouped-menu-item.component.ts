import {Component, Input} from '@angular/core';
import {MenuItem} from '@components/navbar/navbar.abstract';
import {LanguageStrings} from '@base/store/language/language.facade';

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
