import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-varchar-edit',
    templateUrl: './varchar.component.html',
    styleUrls: []
})
export class VarcharEditFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy {

    constructor(protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }

    ngOnInit(): void {
        this.subscribeValueChanges();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll();
    }
}
