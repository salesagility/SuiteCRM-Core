import {Component, Input} from '@angular/core';
import {LanguageStrings} from '@store/language/language.store';
import {MenuItem} from '@app-common/menu/menu.model';

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
