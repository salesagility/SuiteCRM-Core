import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'scrm-table-ui',
    templateUrl: 'table.component.html',

})

export class TableUiComponent implements OnInit {
    @Input() module;

    ngOnInit() {
    }

}
