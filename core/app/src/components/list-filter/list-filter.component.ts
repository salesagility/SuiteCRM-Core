import {Component, OnInit} from '@angular/core';
import {SearchMetaField} from '@store/metadata/metadata.store.service';
import {LanguageStore, LanguageStringMap, LanguageStrings} from '@store/language/language.store';
import {Field} from '@fields/field.model';
import {ListViewStore, SearchCriteria, SearchCriteriaFieldFilter} from '@store/list-view/list-view.store';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';
import {ButtonInterface} from '@components/button/button.model';
import {deepClone} from '@base/utils/object-utils';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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

    constructor(protected listStore: ListViewStore, protected language: LanguageStore) {

        this.vm$ = combineLatest([listStore.criteria$, listStore.metadata$]).pipe(
            map(([criteria, metadata]) => {
                this.reset();
                this.initFields();

                return {criteria, metadata};
            }));

    }

    ngOnInit(): void {

        this.searchCriteria = {
            filters: {}
        };

        this.initFields();
        this.initGridButtons();
        this.initHeaderButtons();
    }

    get appStrings(): LanguageStringMap {
        return this.listStore.appStrings;
    }

    initFields(): void {

        const languages = this.listStore.language;
        const searchCriteria = this.listStore.searchCriteria;
        const searchMeta = this.listStore.searchMeta;
        const searchFields = searchMeta.layout.advanced;

        Object.keys(searchFields).forEach(key => {
            const name = searchFields[key].name;
            if (name.includes('_only')) {
                this.special.push(this.buildField(searchFields[key], languages, searchCriteria));
            } else {
                this.fields.push(this.buildField(searchFields[key], languages, searchCriteria));
            }
        });
    }

    protected reset(): void {
        this.searchCriteria = {
            filters: {}
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
        const module = this.listStore.appState.module;

        const fieldName = searchField.name;
        this.searchCriteria.filters[fieldName] = this.initFieldFilter(searchCriteria, fieldName);

        return {
            type: 'varchar',
            value: '',
            name: searchField.name,
            label: this.language.getFieldLabel(searchField.label, module, languages),
            criteria: this.searchCriteria.filters[fieldName]
        } as Field;
    }

    protected initFieldFilter(searchCriteria: SearchCriteria, fieldName: string): SearchCriteriaFieldFilter {
        let fieldCriteria: SearchCriteriaFieldFilter;

        if (!searchCriteria.filters[fieldName]) {
            fieldCriteria = {
                field: fieldName,
                operator: '',
                values: [],
            };
        } else {
            fieldCriteria = deepClone(searchCriteria.filters[fieldName]);
        }

        return fieldCriteria;
    }

    protected applyFilter(): void {
        this.listStore.showFilters = false;
        this.listStore.updateSearchCriteria(this.searchCriteria);
    }

    protected clearFilter(): void {
        this.listStore.updateSearchCriteria({filters: {}}, false);
    }
}
