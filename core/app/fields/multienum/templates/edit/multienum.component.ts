import {Component, ViewChild} from '@angular/core';
import {LanguageStore} from '@store/language/language.store';
import {BaseMultiEnumComponent} from '@fields/base/base-multienum.component';
import {TagInputComponent} from 'ngx-chips';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-multienum-edit',
    templateUrl: './multienum.component.html',
    styleUrls: []
})
export class MultiEnumEditFieldComponent extends BaseMultiEnumComponent {

    @ViewChild('tag') tag: TagInputComponent;

    constructor(protected languages: LanguageStore, protected typeFormatter: DataTypeFormatter) {
        super(languages, typeFormatter);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    public onAdd(): void {
        const value = this.selectedValues.map(option => option.value);
        this.field.valueList = value;
        this.field.formControl.setValue(value);

        return;
    }

    public onRemove(): void {
        const value = this.selectedValues.map(option => option.value);
        this.field.valueList = value;
        this.field.formControl.setValue(value);
        setTimeout(() => {
            this.tag.focus(true, true);
            this.tag.dropdown.show();
        }, 200);
    }

    public getPlaceholderLabel(): string {
        return this.languages.getAppString('LBL_SELECT_ITEM') || '';
    }
}
