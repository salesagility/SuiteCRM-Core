import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';
import {TagInputComponent} from 'ngx-chips';
import {LanguageStore} from '@store/language/language.store';
import {BaseMultiEnumComponent} from '@fields/base/base-multienum.component';

@Component({
    selector: 'scrm-multienum-filter',
    templateUrl: './multienum.component.html',
    styleUrls: []
})
export class MultiEnumFilterFieldComponent extends BaseMultiEnumComponent implements OnInit, OnDestroy {

    @ViewChild('tag') tag: TagInputComponent;

    constructor(protected languages: LanguageStore, protected typeFormatter: DataTypeFormatter) {
        super(languages, typeFormatter);
    }

    ngOnInit(): void {
        this.field.valueList = [];

        if (this.field.criteria.values && this.field.criteria.values.length > 0) {
            this.field.valueList = this.field.criteria.values;
        }

        super.ngOnInit();

    }

    public onAdd(): void {

        const value = this.selectedValues.map(option => option.value);
        this.field.valueList = value;
        this.field.formControl.setValue(value);
        this.field.formControl.markAsDirty();
        this.field.criteria.operator = '=';
        this.field.criteria.values = value;

        return;
    }

    public onRemove(): void {

        let value = this.selectedValues.map(option => option.value);
        if (!value) {
            value = [];
        }

        this.field.valueList = value;
        this.field.formControl.setValue(value);
        this.field.formControl.markAsDirty();
        this.field.criteria.operator = '=';
        this.field.criteria.values = value;
        setTimeout(() => {
            this.tag.focus(true, true);
            this.tag.dropdown.show();
        }, 200);
    }

    public getPlaceholderLabel(): string {
        return this.languages.getAppString('LBL_SELECT_ITEM') || '';
    }
}
