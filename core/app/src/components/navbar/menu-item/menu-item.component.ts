import {Component, Input} from '@angular/core';
import {MenuItem} from '@components/navbar/navbar.abstract';
import {LanguageStrings} from '@base/store/language/language.facade';

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
