import {Component, OnInit} from '@angular/core';
import {LanguageStore, LanguageStringMap, LanguageStrings} from '@store/language/language.store';
import {ListViewStore} from '@views/list/store/list-view/list-view.store';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';
import {ButtonInterface} from '@components/button/button.model';
import {deepClone} from '@base/app-common/utils/object-utils';
import {combineLatest, Observable} from 'rxjs';
import {filter, map, startWith, take} from 'rxjs/operators';
import {Field, FieldMap} from '@app-common/record/field.model';
import {SearchCriteria, SearchCriteriaFieldFilter} from '@app-common/views/list/search-criteria.model';
import {Filter, SearchMetaField} from '@app-common/metadata/list.metadata.model';
import {FieldManager} from '@services/record/field/field.manager';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {Record} from '@app-common/record/record.model';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MessageService} from '@services/message/message.service';

export interface FilterDataSource {
    getFilter(): Observable<Filter>;
}

@Component({
    selector: 'scrm-list-filter',
    templateUrl: './list-filter.component.html',
    styleUrls: []
})
export class ListFilterComponent implements OnInit {
    mode = 'filter';

    closeButton: ButtonInterface;
    myFilterButton: DropdownButtonInterface;
    quickSearchButton: ButtonInterface;

    gridButtons = [];

    fields: Field[] = [];
    special: Field[] = [];

    searchCriteria: SearchCriteria;

    vm$: Observable<any>;
    private record: Record;

    constructor(
        protected listStore: ListViewStore,
        protected language: LanguageStore,
        protected fieldManager: FieldManager,
        protected message: MessageService
    ) {

        this.vm$ = combineLatest([listStore.criteria$, listStore.metadata$]).pipe(
            map(([criteria, metadata]) => {
                this.reset();
                this.initFields();

                return {criteria, metadata};
            }));

    }

    ngOnInit(): void {

        this.reset();

        this.record = {
            module: this.listStore.getModuleName(),
            attributes: {}
        } as Record;

        this.initFields();
        this.initGridButtons();
        this.initHeaderButtons();
    }

    get appStrings(): LanguageStringMap {
        return this.listStore.appStrings;
    }

    initFields(): void {

        const languages = this.listStore.language;
        const searchCriteria = this.listStore.recordList.criteria;
        const searchMeta = this.listStore.searchMeta;

        let type = 'advanced';
        if (!searchMeta.layout.advanced) {
            type = 'basic';
        }

        const searchFields = searchMeta.layout[type];
        const fields = {} as FieldMap;
        const formControls = {} as { [key: string]: AbstractControl };

        Object.keys(searchFields).forEach(key => {
            const name = searchFields[key].name;

            fields[name] = this.buildField(searchFields[key], languages, searchCriteria);
            formControls[name] = fields[name].formControl;

            if (name.includes('_only')) {
                this.special.push(fields[name]);
            } else {
                this.fields.push(fields[name]);
            }
        });

        this.record.formGroup = new FormGroup(formControls);
    }

    protected reset(): void {
        this.searchCriteria = {
            filters: {},
        };

        this.fields = [];
        this.special = [];
    }

    protected initGridButtons(): void {
        this.gridButtons = [
            {
                label: this.listStore.appStrings.LBL_CLEAR_BUTTON_LABEL || '',
                klass: ['clear-filters-button', 'btn', 'btn-outline-danger', 'btn-sm'],
                onClick: this.clearFilter.bind(this)
            },
            {
                label: this.listStore.appStrings.LBL_SEARCH_BUTTON_LABEL || '',
                klass: ['filter-button', 'btn', 'btn-danger', 'btn-sm'],
                onClick: this.applyFilter.bind(this)
            }
        ] as ButtonInterface[];
    }

    protected initHeaderButtons(): void {

        this.closeButton = {
            onClick: (): void => {
                this.listStore.showFilters = false;
            }
        } as ButtonInterface;

        this.myFilterButton = {
            label: this.listStore.appStrings.LBL_SAVED_FILTER_SHORTCUT || '',
            klass: ['saved-filters-button', 'btn', 'btn-outline-light', 'btn-sm'],
            items: []
        } as DropdownButtonInterface;

        this.quickSearchButton = {
            label: this.listStore.appStrings.LBL_QUICK || '',
            klass: ['quick-filter-button', 'btn', 'btn-outline-light', 'btn-sm']
        };
    }

    protected buildField(searchField: SearchMetaField, languages: LanguageStrings, searchCriteria: SearchCriteria): Field {
        const fieldName = searchField.name;
        const type = searchField.type;
        this.searchCriteria.filters[fieldName] = this.initFieldFilter(searchCriteria, fieldName, type);

        const definition = {
            name: searchField.name,
            label: searchField.label,
            type,
            fieldDefinition: {}
        } as ViewFieldDefinition;

        if (searchField.fieldDefinition) {
            definition.fieldDefinition = searchField.fieldDefinition;
        }

        if (type === 'bool' || type === 'boolean') {
            definition.fieldDefinition.options = 'dom_int_bool';
        }


        const field = this.fieldManager.buildFilterField(this.record, definition, this.language);

        field.criteria = this.searchCriteria.filters[fieldName];

        return field;
    }

    protected initFieldFilter(searchCriteria: SearchCriteria, fieldName: string, fieldType: string): SearchCriteriaFieldFilter {
        let fieldCriteria: SearchCriteriaFieldFilter;

        if (searchCriteria.filters[fieldName]) {
            fieldCriteria = deepClone(searchCriteria.filters[fieldName]);
        } else {
            fieldCriteria = {
                field: fieldName,
                fieldType,
                operator: '',
                values: []
            };
        }

        return fieldCriteria;
    }

    protected applyFilter(): void {
        this.validate().pipe(take(1)).subscribe(valid => {

            if (valid) {
                this.listStore.showFilters = false;
                this.listStore.updateSearchCriteria(this.searchCriteria);
                return;
            }

            this.message.addWarningMessageByKey('LBL_VALIDATION_ERRORS');
        });

    }

    protected validate(): Observable<boolean> {

        this.record.formGroup.markAllAsTouched();
        return this.record.formGroup.statusChanges.pipe(
            startWith(this.record.formGroup.status),
            filter(status => status !== 'PENDING'),
            take(1),
            map(status => status === 'VALID')
        );
    }

    protected clearFilter(): void {
        this.listStore.updateSearchCriteria({filters: {}}, false);
    }
}
