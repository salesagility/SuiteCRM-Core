import {Component} from '@angular/core';
import {RecordViewStore} from '@store/record-view/record-view.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';

@Component({
    selector: 'scrm-subpanel',
    templateUrl: 'subpanel.component.html',
})
export class SubpanelComponent {
    constructor(protected recordViewStore: RecordViewStore, protected moduleNavigation: ModuleNavigation) {
    }
}
