import {Component, Input} from '@angular/core';
import {MenuItem} from '@components/navbar/navbar.abstract';
import {LanguageStrings} from '@store/language/language.store';

@Component({
    selector: 'scrm-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: []
})
export class MenuItemComponent {
    @Input() item: MenuItem;
    @Input() languages: LanguageStrings;

    constructor() {
    }
}
