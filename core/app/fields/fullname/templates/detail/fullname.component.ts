import {Component, OnInit} from '@angular/core';
import {BaseNameComponent} from '@fields/base/base-name.component';

@Component({
    selector: 'scrm-fullname-detail',
    templateUrl: './fullname.component.html',
    styleUrls: []
})
export class FullNameDetailFieldsComponent extends BaseNameComponent implements OnInit {
    data: string;

    ngOnInit(): void {
        this.data = this.getNameField(this.field, this.record);
    }
}
