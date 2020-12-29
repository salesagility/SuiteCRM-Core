import {BaseEnumComponent} from '@fields/base/base-enum.component';
import {LanguageStore} from '@store/language/language.store';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

export class BaseMultiEnumComponent extends BaseEnumComponent {

    constructor(protected languages: LanguageStore, protected typeFormatter: DataTypeFormatter) {
        super(languages, typeFormatter);
    }

    protected initValue(): void {
        this.selectedValues = [];

        if (!this.field.valueList || this.field.valueList.length < 1) {
            return;
        }

        this.field.valueList.forEach(value => {
            if (typeof this.optionsMap[value] !== 'string') {
                return;
            }
            this.selectedValues.push({
                value,
                label: this.optionsMap[value]
            });
        });
    }
}
