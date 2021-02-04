import {LanguageStore} from '@store/language/language.store';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';
import {catchError, map, tap} from 'rxjs/operators';
import {AttributeMap, Record} from '@app-common/record/record.model';
import {RelateService} from '@services/record/relate/relate.service';
import {BaseFieldComponent} from '@fields/base/base-field.component';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';

@Component({template: ''})
export class BaseRelateComponent extends BaseFieldComponent implements OnInit, OnDestroy {
    selectedValues: AttributeMap[] = [];

    status: '' | 'searching' | 'not-found' | 'error' | 'found' = '';

    constructor(
        protected languages: LanguageStore,
        protected typeFormatter: DataTypeFormatter,
        protected relateService: RelateService,
        protected moduleNameMapper: ModuleNameMapper
    ) {
        super(typeFormatter);
    }

    get module(): string {
        if (!this.record || !this.record.module) {
            return null;
        }

        return this.record.module;
    }

    ngOnInit(): void {
        this.initValue();

        if (this.relateService) {
            this.relateService.init(this.getRelatedModule());
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    search = (text: string): Observable<any> => {

        this.status = 'searching';

        return this.relateService.search(text, this.getRelateFieldName()).pipe(
            tap(() => this.status = 'found'),
            catchError(() => {
                this.status = 'error';
                return of([]);
            }),
            map(records => {
                if (!records || records.length < 1) {
                    this.status = 'not-found';
                    return [];
                }

                const flatRecords: AttributeMap[] = [];

                records.forEach((record: Record) => {
                    if (record && record.attributes) {
                        flatRecords.push(record.attributes);
                    }
                });

                this.status = '';

                return flatRecords;
            }),
        );
    };

    getRelateFieldName(): string {
        return (this.field && this.field.definition && this.field.definition.rname) || 'name';
    }

    getRelatedModule(): string {
        const legacyName = (this.field && this.field.definition && this.field.definition.module) || '';
        if (!legacyName) {
            return '';
        }

        return this.moduleNameMapper.toFrontend(legacyName);
    }

    getMessage(): string {
        const messages = {
            searching: 'LBL_SEARCHING',
            'not-found': 'LBL_NOT_FOUND',
            error: 'LBL_SEARCH_ERROR',
            found: 'LBL_FOUND',
            'no-module': 'LBL_FOUND'
        };

        if (messages[this.status]) {
            return messages[this.status];
        }

        return '';
    }

    getInvalidClass(): string {
        if (this.field.formControl && this.field.formControl.invalid && this.field.formControl.touched) {
            return 'is-invalid';
        }

        if (this.hasSearchError()) {
            return 'is-invalid';
        }

        return '';
    }

    hasSearchError(): boolean {
        return this.status === 'error' || this.status === 'not-found';
    }

    resetStatus(): void {
        this.status = '';
    }

    getPlaceholderLabel(): string {
        return this.languages.getAppString('LBL_TYPE_TO_SEARCH') || '';
    }

    protected buildRelate(id: string, relateValue: string): any {
        const relate = {id};

        if (this.getRelateFieldName()) {
            relate[this.getRelateFieldName()] = relateValue;
        }

        return relate;
    }


    protected initValue(): void {
        if (!this.field.valueObject) {
            return;
        }

        if (!this.field.valueObject.id) {
            return;
        }

        this.selectedValues = [];
        this.selectedValues.push(this.field.valueObject);
    }
}
