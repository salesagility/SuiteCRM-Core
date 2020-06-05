import {Component, Input} from '@angular/core';

@Component({
    selector: 'scrm-table-ui',
    templateUrl: 'table.component.html',

})

export class TableUiComponent {
    @Input() module;
}
