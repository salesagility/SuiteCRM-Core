import {BaseFieldComponent} from './base-field.component';
import {LanguageListStringMap, LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Option} from '@app-common/record/field.model';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';


@Component({template: ''})
export class BaseEnumComponent extends BaseFieldComponent implements OnInit, OnDestroy {
    selectedValues: Option[] = [];
    valueLabel = '';
    optionsMap: LanguageStringMap;
    options: Option[] = [];
    labels: LanguageStringMap;
    protected subs: Subscription[] = [];

    constructor(protected languages: LanguageStore, protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }


    ngOnInit(): void {

        if (this.field.metadata && this.field.metadata.options$) {
            this.subs.push(this.field.metadata.options$.subscribe((options: Option[]) => {
                this.buildProvidedOptions(options);

                this.initValue();

            }));
            return;

        }

        if (this.field.definition && this.field.definition.options) {
            this.subs.push(this.languages.appListStrings$.subscribe((appStrings: LanguageListStringMap) => {

                this.buildAppStringListOptions(appStrings);
                this.initValue();

            }));
        }


    }


    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    getInvalidClass(): string {
        if (this.field.formControl && this.field.formControl.invalid && this.field.formControl.touched) {
            return 'is-invalid';
        }
        return '';
    }

    protected buildProvidedOptions(options: Option[]): void {
        this.options = options;

        this.optionsMap = {};
        options.forEach(option => {
            this.optionsMap[option.value] = option.label;
        });
    }

    protected buildAppStringListOptions(appStrings: LanguageListStringMap): void {

        if (!appStrings || !this.field.definition.options || !appStrings[this.field.definition.options]) {
            return;
        }

        this.optionsMap = appStrings[this.field.definition.options] as LanguageStringMap;
        if (!this.optionsMap || !Object.keys(this.optionsMap)) {
            return;
        }
        this.buildOptionsArray();
    }

    protected buildOptionsArray(): void {
        this.options = [];
        Object.keys(this.optionsMap).forEach(key => {

            this.options.push({
                value: key,
                label: this.optionsMap[key]
            });
        });
    }

    protected initValue(): void {
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
    }
}
