import {Component} from '@angular/core';
import {RecordViewStore} from '@views/record/store/record-view/record-view.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';

@Component({
    selector: 'scrm-status-bar',
    templateUrl: 'status-bar.component.html',
})
export class StatusBarComponent {

    displayResponsiveTable = false;

    constructor(protected recordViewStore: RecordViewStore, protected moduleNavigation: ModuleNavigation) {
    }
}
