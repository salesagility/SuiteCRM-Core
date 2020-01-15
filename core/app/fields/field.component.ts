import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ViewContainerRef
} from '@angular/core';

import {AppManager} from '../src/app-manager/app-manager.service';

@Component({
    selector: 'scrm-field',
    template: `
        <ng-template #fieldOutlet></ng-template>
    `,
    styleUrls: []
})
export class FieldComponent implements OnInit {
    @ViewChild('fieldOutlet', {read: ViewContainerRef})
    fieldOutlet: ViewContainerRef | undefined;

    id: string;

    @Input('view-type') viewType: string;
    @Input('field-type') fieldType: string;
    @Input('field-name') fieldName: string;
    @Input('field-value') fieldValue: string;
    @Input('row') row: any;

    constructor(protected appManager: AppManager) {
    }

    ngOnInit() {
        this.id = this.makeId(8);

        if (this.fieldType == 'phone') {
            this.fieldType = 'varchar';
        }

        if (this.fieldType == 'name') {
            this.fieldType = 'varchar';
        }

        let data = {
            'viewType': this.viewType,
            'fieldType': this.fieldType,
            'fieldName': this.fieldName,
            'fieldValue': this.fieldValue,
            'row': JSON.parse(this.row),
        };

        const componentId = 'scrm-' + this.fieldType + '-' + this.viewType;
        this.appManager.loadAppComponent(this.fieldOutlet, componentId, data);
    }

    makeId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

}
