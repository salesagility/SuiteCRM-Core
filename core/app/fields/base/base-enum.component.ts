import {BaseFieldComponent} from './base-field.component';
import {LanguageListStringMap, LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

export interface Option {
    value: string;
    label: string;
}

export class BaseEnumComponent extends BaseFieldComponent implements OnInit, OnDestroy {
    selectedValues: Option[] = [];
    valueLabel = '';
    optionsMap: LanguageStringMap;
    options: Option[] = [];
    labels: LanguageStringMap;
    protected subs: Subscription[] = [];

    constructor(protected languages: LanguageStore) {
        super();
    }


    ngOnInit(): void {
        this.subs.push(this.languages.appListStrings$.subscribe((appStrings: LanguageListStringMap) => {

            if (!appStrings || !this.field.definition.options || !appStrings[this.field.definition.options]) {
                return;
            }

            this.optionsMap = appStrings[this.field.definition.options] as LanguageStringMap;
            if (!this.optionsMap || !Object.keys(this.optionsMap)) {
                return;
            }

            this.options = [];
            Object.keys(this.optionsMap).forEach(key => {
                this.options.push({
                    value: key,
                    label: this.optionsMap[key]
                });
            });

            if (typeof this.field.value !== 'string') {
                return;
            }

            if (typeof this.optionsMap[this.field.value] !== 'string') {
                return;
            }

            this.selectedValues = [];
            if (this.field.value) {
                this.valueLabel = this.optionsMap[this.field.value];
                this.selectedValues.push({
                    value: this.field.value,
                    label: this.valueLabel
                });
            }

        }));
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

}
