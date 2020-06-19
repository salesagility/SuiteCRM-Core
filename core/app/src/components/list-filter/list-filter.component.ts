import {Component, OnInit} from '@angular/core';
import {SearchMetaField} from '@store/metadata/metadata.store.service';
import {LanguageStore, LanguageStringMap, LanguageStrings} from '@store/language/language.store';
import {Field} from '@fields/field.model';
import {ListViewStore} from '@store/list-view/list-view.store';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';
import {ButtonInterface} from '@components/button/button.model';

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

    constructor(protected listStore: ListViewStore, protected language: LanguageStore) {

    }

    ngOnInit(): void {
        this.initFields();
        this.initGridButtons();
        this.initHeaderButtons();
    }

    get appStrings(): LanguageStringMap {
        return this.listStore.appStrings;
    }

    initFields(): void {

        const languages = this.listStore.language;
        const searchMeta = this.listStore.searchMeta;
        const searchFields = searchMeta.layout.advanced;

        Object.keys(searchFields).forEach(key => {
            const name = searchFields[key].name;
            if (name.includes('_only')) {
                this.special.push(this.buildField(searchFields[key], languages));
            } else {
                this.fields.push(this.buildField(searchFields[key], languages));
            }
        });
    }

    protected initGridButtons(): void {
        this.gridButtons = [
            {
                label: this.listStore.appStrings.LBL_CLEAR_BUTTON_LABEL || '',
                klass: ['clear-filters-button', 'btn', 'btn-outline-danger', 'btn-sm']
            },
            {
                label: this.listStore.appStrings.LBL_SEARCH_BUTTON_LABEL || '',
                klass: ['filter-button', 'btn', 'btn-danger', 'btn-sm']
            }
        ];
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

    protected buildField(searchField: SearchMetaField, languages: LanguageStrings): Field {
        const module = this.listStore.appState.module;
        return {
            type: 'varchar',
            value: '',
            name: searchField.name,
            label: this.language.getFieldLabel(searchField.label, module, languages)
        } as Field;
    }
}
