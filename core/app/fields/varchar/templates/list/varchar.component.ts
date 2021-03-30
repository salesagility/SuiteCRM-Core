import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'scrm-varchar-list',
    templateUrl: './varchar.component.html',
    styleUrls: []
})
export class VarcharListFieldsComponent implements OnInit {

    data: any = {};
    link = '#';
    class = 'text';

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewChecked() {
        //console.log('dbg: [VarcharListViewComponent.ngAfterViewChecked]', this.data);
        if (this.data && this.data.fieldName && this.data.fieldName == 'name') {
            this.link = '#/' + this.data.row.module_name + '/DetailView/' + this.data.row.id;
            this.class = 'name';
            // this.link = '#/' + (this.data && this.data.fieldName && this.data.row && this.data.row.field_name_map &&
            //   this.data.row.field_name_map[this.data.fieldName] && this.data.row.field_name_map[this.data.fieldName].module ?
            //   this.data.row.field_name_map[this.data.fieldName].module : '') + '/DetailView/' + (this.data && this.data.row &&
            //     this.data.row.field_name_map && this.data.row.field_name_map[this.data.fieldName] &&
            //     this.data.row.field_name_map[this.data.fieldName].id_name &&
            //     this.data.row[this.data.row.field_name_map[this.data.fieldName].id_name] ?
            //     this.data.row[this.data.row.field_name_map[this.data.fieldName].id_name] : '');
        }
    }

}