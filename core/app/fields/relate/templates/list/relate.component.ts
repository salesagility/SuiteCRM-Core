import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'scrm-relate-list',
    templateUrl: './relate.component.html',
    styleUrls: []
})
export class RelateListFieldsComponent implements OnInit {
    data: any = {};
    link = '#/';

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewChecked() {
        //console.log('dbg: [RelateListViewModule.ngAfterViewChecked]', this.data);
        this.link = '#/' + (this.data && this.data.fieldName && this.data.row && this.data.row.field_name_map &&
        this.data.row.field_name_map[this.data.fieldName] && this.data.row.field_name_map[this.data.fieldName].module ?
            this.data.row.field_name_map[this.data.fieldName].module : '') + '/DetailView/' + (this.data && this.data.row &&
        this.data.row.field_name_map && this.data.row.field_name_map[this.data.fieldName] &&
        this.data.row.field_name_map[this.data.fieldName].id_name &&
        this.data.row[this.data.row.field_name_map[this.data.fieldName].id_name] ?
            this.data.row[this.data.row.field_name_map[this.data.fieldName].id_name] : '');
    }

}