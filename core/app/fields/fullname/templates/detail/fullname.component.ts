import {Component, OnInit} from '@angular/core';
import {BaseNameComponent} from '@fields/base/base-name.component';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-fullname-detail',
    templateUrl: './fullname.component.html',
    styleUrls: []
})
export class FullNameDetailFieldsComponent extends BaseNameComponent implements OnInit {
    data: string;

    constructor(protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }

    ngOnInit(): void {
        this.data = this.getNameField(this.field, this.record);
    }
}
