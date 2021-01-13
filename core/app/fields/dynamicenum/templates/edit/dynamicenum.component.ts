import {Component, ViewChild} from '@angular/core';
import {BaseEnumComponent} from '@fields/base/base-enum.component';
import {LanguageStore} from '@store/language/language.store';
import {TagInputComponent} from 'ngx-chips';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-dynamicenum-edit',
    templateUrl: './dynamicenum.component.html',
    styleUrls: []
})
export class DynamicEnumEditFieldComponent extends BaseEnumComponent {

    @ViewChild('tag') tag: TagInputComponent;

    constructor(protected languages: LanguageStore, protected typeFormatter: DataTypeFormatter) {
        super(languages, typeFormatter);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    public onAdd(item): void {
        if (item && item.value) {
            this.field.value = item.value;
            this.field.formControl.setValue(item.value);
            this.field.formControl.markAsDirty();
            return;
        }

        this.field.value = '';
        this.field.formControl.setValue('');
        this.field.formControl.markAsDirty();
        this.selectedValues = [];

        return;
    }

    public onRemove(): void {
        this.field.value = '';
        this.field.formControl.setValue('');
        this.field.formControl.markAsDirty();
        setTimeout(() => {
            this.tag.focus(true, true);
            this.tag.dropdown.show();
        }, 200);
    }

    public getPlaceholderLabel(): string {
        return this.languages.getAppString('LBL_SELECT_ITEM') || '';
    }
}
