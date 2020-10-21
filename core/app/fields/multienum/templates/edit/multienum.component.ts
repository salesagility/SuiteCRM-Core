import {Component} from '@angular/core';
import {LanguageStore} from '@store/language/language.store';
import {BaseMultiEnumComponent} from '@fields/base/base-multienum.component';

@Component({
    selector: 'scrm-multienum-edit',
    templateUrl: './multienum.component.html',
    styleUrls: []
})
export class MultiEnumEditFieldComponent extends BaseMultiEnumComponent {

    constructor(protected languages: LanguageStore) {
        super(languages);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    public onAdd(): void {
        this.field.valueList = this.selectedValues.map(option => option.value);

        return;
    }

    public onRemove(): void {
        this.field.valueList = this.selectedValues.map(option => option.value);
    }

    public getPlaceholderLabel(): string {
        return this.languages.getAppString('LBL_SELECT_ITEM') || '';
    }
}
