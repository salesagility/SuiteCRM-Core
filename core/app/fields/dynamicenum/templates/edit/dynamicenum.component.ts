import {Component, ViewChild} from '@angular/core';
import {BaseEnumComponent} from '@fields/base/base-enum.component';
import {LanguageStore} from '@store/language/language.store';
import {TagInputComponent} from 'ngx-chips';

@Component({
    selector: 'scrm-dynamicenum-edit',
    templateUrl: './dynamicenum.component.html',
    styleUrls: []
})
export class DynamicEnumEditFieldComponent extends BaseEnumComponent {

    @ViewChild('tag') tag: TagInputComponent;

    constructor(protected languages: LanguageStore) {
        super(languages);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    public onAdd(item): void {
        if (item && item.value) {
            this.field.value = item.value;
            return;
        }

        this.field.value = '';
        this.selectedValues = [];

        return;
    }

    public onRemove(): void {
        this.field.value = '';
        setTimeout(() => {
            this.tag.focus(true, true);
            this.tag.dropdown.show();
        }, 200);
    }

    public getPlaceholderLabel(): string {
        return this.languages.getAppString('LBL_SELECT_ITEM') || '';
    }
}
