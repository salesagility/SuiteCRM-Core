import {Component, Input} from '@angular/core';
import {LanguageStrings} from '@store/language/language.store';
import {RecentRecordsMenuItem} from '@app-common/menu/menu.model';

@Component({
    selector: 'scrm-menu-recently-viewed',
    templateUrl: './menu-recently-viewed.component.html',
    styleUrls: []
})
export class MenuRecentlyViewedComponent {
    @Input() records: RecentRecordsMenuItem[];
    @Input() languages: LanguageStrings;

    constructor() {
    }
}
