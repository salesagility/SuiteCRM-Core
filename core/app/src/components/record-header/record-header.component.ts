import {Component} from '@angular/core';
import {RecordViewStore} from '@store/record-view/record-view.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';

@Component({
    selector: 'scrm-record-header',
    templateUrl: 'record-header.component.html',
})
export class RecordHeaderComponent {

    displayResponsiveTable = false;

    constructor(protected recordViewStore: RecordViewStore, protected moduleNavigation: ModuleNavigation) {
    }

    get moduleTitle(): string {
        return '';
    }
}
