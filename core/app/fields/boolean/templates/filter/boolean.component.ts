import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';
import {TagInputComponent} from 'ngx-chips';
import {LanguageStore} from '@store/language/language.store';
import {BaseEnumComponent} from '@fields/base/base-enum.component';

@Component({
    selector: 'scrm-boolean-filter',
    templateUrl: './boolean.component.html',
    styleUrls: []
})
export class BooleanFilterFieldComponent extends BaseEnumComponent implements OnInit, OnDestroy {

    @ViewChild('tag') tag: TagInputComponent;

    constructor(protected languages: LanguageStore, protected typeFormatter: DataTypeFormatter) {
        super(languages, typeFormatter);
    }

    ngOnInit(): void {
        this.field.value = '';

        if (this.field.criteria.values && this.field.criteria.values.length > 0) {
            this.field.value = this.field.criteria.values[0];
        }

        super.ngOnInit();

    }

    public onAdd(item): void {
        if (item && item.value) {
            this.field.value = item.value;
            this.field.formControl.setValue(item.value);
            this.field.criteria.operator = '=';
            this.field.criteria.values = [item.value];
            return;
        }

        this.field.value = '';
        this.field.formControl.setValue('');
        this.selectedValues = [];
        this.field.criteria.operator = '';
        this.field.criteria.values = [];

        return;
    }

    public onRemove(): void {
        this.field.value = '';
        this.field.formControl.setValue('');
        this.field.criteria.operator = '';
        this.field.criteria.values = [];
        setTimeout(() => {
            this.tag.focus(true, true);
            this.tag.dropdown.show();
        }, 200);
    }

    public getPlaceholderLabel(): string {
        return this.languages.getAppString('LBL_SELECT_ITEM') || '';
    }
}
