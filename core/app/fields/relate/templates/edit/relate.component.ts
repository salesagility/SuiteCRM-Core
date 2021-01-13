import {Component, ViewChild} from '@angular/core';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';
import {LanguageStore} from '@store/language/language.store';
import {TagInputComponent} from 'ngx-chips';
import {RelateService} from '@services/record/relate/relate.service';
import {BaseRelateComponent} from '@fields/base/base-relate.component';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';

@Component({
    selector: 'scrm-relate-edit',
    templateUrl: './relate.component.html',
    styleUrls: [],
    providers: [RelateService]
})
export class RelateEditFieldComponent extends BaseRelateComponent {
    @ViewChild('tag') tag: TagInputComponent;

    constructor(
        protected languages: LanguageStore,
        protected typeFormatter: DataTypeFormatter,
        protected relateService: RelateService,
        protected moduleNameMapper: ModuleNameMapper
    ) {
        super(languages, typeFormatter, relateService, moduleNameMapper);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    onAdd(item): void {

        if (item) {
            const relateName = this.getRelateFieldName();
            this.setValue(item.id, item[relateName]);
            return;
        }

        this.setValue('', '');
        this.selectedValues = [];

        return;
    }

    onRemove(): void {
        this.setValue('', '');
        this.selectedValues = [];

        setTimeout(() => {
            this.tag.focus(true, true);
        }, 200);
    }

    protected setValue(id: string, relateValue: string): void {
        const relate = this.buildRelate(id, relateValue);
        this.field.value = relateValue;
        this.field.valueObject = relate;
        this.field.formControl.setValue(relateValue);
        this.field.formControl.markAsDirty();
    }
}
