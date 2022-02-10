/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Component, ViewChild} from '@angular/core';
import {TagInputComponent} from 'ngx-chips';
import {ButtonInterface, Field, Record, deepClone} from 'common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModuleNameMapper} from '../../../../services/navigation/module-name-mapper/module-name-mapper.service';
import {DataTypeFormatter} from '../../../../services/formatters/data-type.formatter.service';
import {RecordListModalComponent} from '../../../../containers/record-list-modal/components/record-list-modal/record-list-modal.component';
import {BaseRelateComponent} from '../../../base/base-relate.component';
import {LanguageStore} from '../../../../store/language/language.store';
import {RelateService} from '../../../../services/record/relate/relate.service';
import {RecordListModalResult} from '../../../../containers/record-list-modal/components/record-list-modal/record-list-modal.model';
import {TagModel} from 'ngx-chips/core/accessor';
import {FieldLogicManager} from '../../../field-logic/field-logic.manager';
import {SavedFilter} from '../../../../store/saved-filters/saved-filter.model';
import {EMPTY, Observable, of} from 'rxjs';

@Component({
    selector: 'scrm-relate-filter',
    templateUrl: './relate.component.html',
    styleUrls: [],
    providers: [RelateService]
})
export class RelateFilterFieldComponent extends BaseRelateComponent {
    @ViewChild('tag') tag: TagInputComponent;
    selectButton: ButtonInterface;
    selectedTags: string[] | TagModel[];
    idField: Field;

    /**
     * Constructor
     *
     * @param {object} languages service
     * @param {object} typeFormatter service
     * @param {object} relateService service
     * @param {object} moduleNameMapper service
     * @param {object} modalService service
     * @param {object} logic
     */
    constructor(
        protected languages: LanguageStore,
        protected typeFormatter: DataTypeFormatter,
        protected relateService: RelateService,
        protected moduleNameMapper: ModuleNameMapper,
        protected modalService: NgbModal,
        protected logic: FieldLogicManager
    ) {
        super(languages, typeFormatter, relateService, moduleNameMapper, logic);

        this.selectButton = {
            klass: ['btn', 'btn-sm', 'btn-outline-secondary', 'select-button', 'm-0'],
            onClick: (): void => {
                this.showSelectModal();
            },
            icon: 'cursor'
        } as ButtonInterface;
    }

    /**
     * On init handler
     */
    ngOnInit(): void {
        const filter = this.record as SavedFilter;

        this.field.valueList = [];

        this.field.valueObjectArray = [];

        const values = (this.field && this.field.criteria && this.field.criteria.values) || [];

        if (values.length > 0) {
            this.field.valueList = values;
            this.selectedTags = values;
        }

        const valueObjectArray = (this.field && this.field.criteria && this.field.criteria.valueObjectArray) || [];

        if (valueObjectArray.length > 0) {
            this.field.valueObjectArray = deepClone(valueObjectArray);
            this.selectedTags = deepClone(valueObjectArray);
        }

        super.ngOnInit();

        const idFieldName = this.getRelateIdField();

        if (idFieldName && filter && filter.criteriaFields && filter.criteriaFields[idFieldName]) {
            this.idField = filter.criteriaFields[idFieldName];
            this.idField.valueList = [];
            const idValues = (this.idField && this.idField.criteria && this.idField.criteria.values) || [];

            if (idValues.length > 0) {
                this.idField.valueList = deepClone(idValues);
            }
        }
    }

    /**
     * Handle newly added item
     *
     * @param {object} item added
     */
    onAdd(item): void {

        if (item) {

            this.setValue(item);
            return;
        }
    }

    onAdding(item): Observable<TagModel> {

        if (!item) {
            return EMPTY;
        }

        if(this.idField && this.idField.valueList.includes(item.id)){
            return EMPTY;
        }

        const relateName = this.getRelateFieldName();

        if(!this.idField && this.field.valueList.includes(item[relateName])){
            return EMPTY;
        }

        return of(item);
    }

    /**
     * Handle item removal
     */
    onRemove(item): void {

        const id = item.id ?? '';
        const value = item.name ?? '';
        this.field.valueList = this.field.valueList.filter(element => element !== value);

        this.field.valueObjectArray = this.field.valueObjectArray.filter(element => element.id !== id);

        this.updateSearchCriteria(this.field);

        this.field.criteria.valueObjectArray = deepClone(this.field.valueObjectArray);

        if(this.idField && id){
            this.idField.valueList = this.idField.valueList.filter(element => element !== id);
            this.updateSearchCriteria(this.idField);
        }

        setTimeout(() => {
            this.tag.focus(true, true);
        }, 200);
    }

    selectFirstElement(): void {
        const filteredElements: TagModel = this.tag.dropdown.items;
        if (filteredElements.length !== 0) {
            const firstElement = filteredElements[0];
            this.tag.appendTag(firstElement);
            this.onAdd(firstElement);
            this.tag.dropdown.hide();
        }
    }

    /**
     * Set value on field
     *
     * @param item: any
     */
    protected setValue(item: any): void {

        const relateName = this.getRelateFieldName();
        const id = item.id;
        const relateValue = item[relateName];

        if(this.idField && this.idField.valueList.includes(id)){
            return;
        }

        if(!this.idField && this.field.valueList.includes(relateValue)){
            return;
        }

        const valueObject = {} as any;
        valueObject.id = id;
        valueObject[relateName] = relateValue;

        this.field.valueObjectArray.push(valueObject);
        this.field.valueList.push(relateValue);

        if (this.idField){
            this.idField.valueList.push(id);
            this.updateSearchCriteria(this.idField);
        }

        this.updateSearchCriteria(this.field);

        if(!this.field.criteria.valueObjectArray){
            this.field.criteria.valueObjectArray = [];
        }

        this.field.criteria.valueObjectArray.push(valueObject);
    }

    /**
     * Set value on field criteria and form
     */
    protected updateSearchCriteria(field: Field): void {
        field.criteria.operator = '=';
        field.criteria.values = field.valueList;
        field.formControl.setValue(field.valueList);
        field.formControl.markAsDirty();
    }

    /**
     * Show record selection modal
     */
    protected showSelectModal(): void {
        const modal = this.modalService.open(RecordListModalComponent, {size: 'xl', scrollable: true});

        modal.componentInstance.module = this.getRelatedModule();

        modal.result.then((data: RecordListModalResult) => {

            if (!data || !data.selection || !data.selection.selected) {
                return;
            }

            const record = this.getSelectedRecord(data);

            const found = this.field.valueObjectArray.find(element => element.id === record.id);

            if (found) {
                return;
            }

            this.setItem(record);
        });
    }

    /**
     * Get Selected Record
     *
     * @param {object} data RecordListModalResult
     * @returns {object} Record
     */
    protected getSelectedRecord(data: RecordListModalResult): Record {
        let id = '';
        Object.keys(data.selection.selected).some(selected => {
            id = selected;
            return true;
        });

        let record: Record = null;

        data.records.some(rec => {
            if (rec && rec.id === id) {
                record = rec;
                return true;
            }
        });

        return record;
    }

    /**
     * Set the record as the selected item
     *
     * @param {object} record to set
     */
    protected setItem(record: Record): void {
        this.tag.appendTag(record.attributes);
        this.onAdd(record.attributes);
    }

}
