import {Component, ViewChild} from '@angular/core';
import {LanguageStore} from '@store/language/language.store';
import {BaseMultiEnumComponent} from '@fields/base/base-multienum.component';
import {TagInputComponent} from 'ngx-chips';

@Component({
    selector: 'scrm-multienum-edit',
    templateUrl: './multienum.component.html',
    styleUrls: []
})
export class MultiEnumEditFieldComponent extends BaseMultiEnumComponent {

    @ViewChild('tag') tag: TagInputComponent;

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
        setTimeout(() => {
            this.tag.focus(true, true);
            this.tag.dropdown.show();
        }, 200);
    }

    public getPlaceholderLabel(): string {
        return this.languages.getAppString('LBL_SELECT_ITEM') || '';
    }
}
