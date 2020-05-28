import {Component, Input} from '@angular/core';
import {LanguageStrings} from '@base/store/language/language.facade';
import {RecentRecordsMenuItem} from '@components/navbar/navbar.abstract';

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
