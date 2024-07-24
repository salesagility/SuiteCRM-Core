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

import {Component, ElementRef, ViewChild} from '@angular/core';
import {emptyObject} from '../../../../common/utils/object-utils';
import {ButtonInterface} from '../../../../common/components/button/button.model';
import {Field} from '../../../../common/record/field.model';
import {Record, AttributeMap} from '../../../../common/record/record.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModuleNameMapper} from '../../../../services/navigation/module-name-mapper/module-name-mapper.service';
import {DataTypeFormatter} from '../../../../services/formatters/data-type.formatter.service';
import {
    RecordListModalComponent
} from '../../../../containers/record-list-modal/components/record-list-modal/record-list-modal.component';
import {BaseRelateComponent} from '../../../base/base-relate.component';
import {LanguageStore} from '../../../../store/language/language.store';
import {RelateService} from '../../../../services/record/relate/relate.service';
import {
    RecordListModalResult
} from '../../../../containers/record-list-modal/components/record-list-modal/record-list-modal.model';
import {FieldLogicManager} from '../../../field-logic/field-logic.manager';
import {FieldLogicDisplayManager} from '../../../field-logic-display/field-logic-display.manager';
import {map, take} from "rxjs/operators";
import {Dropdown, DropdownFilterOptions} from "primeng/dropdown";

@Component({
    selector: 'scrm-relate-edit',
    templateUrl: './relate.component.html',
    styleUrls: [],
    providers: [RelateService]
})
export class RelateEditFieldComponent extends BaseRelateComponent {
    @ViewChild('tag') tag: Dropdown;
    @ViewChild('dropdownFilterInput') dropdownFilterInput: ElementRef;
    selectButton: ButtonInterface;
    idField: Field;
    selectedValue: AttributeMap = {};

    placeholderLabel: string = '';
    emptyFilterLabel: string = '';
    filterValue: string | undefined = '';

    /**
     * Constructor
     *
     * @param {object} languages service
     * @param {object} typeFormatter service
     * @param {object} relateService service
     * @param {object} moduleNameMapper service
     * @param {object} modalService service
     * @param {object} logic
     * @param {object} logicDisplay
     */
    constructor(
        protected languages: LanguageStore,
        protected typeFormatter: DataTypeFormatter,
        protected relateService: RelateService,
        protected moduleNameMapper: ModuleNameMapper,
        protected modalService: NgbModal,
        protected logic: FieldLogicManager,
        protected logicDisplay: FieldLogicDisplayManager
    ) {
        super(languages, typeFormatter, relateService, moduleNameMapper, logic, logicDisplay);
    }

    /**
     * On init handler
     */
    ngOnInit(): void {

        super.ngOnInit();
        this.init();
        this.getTranslatedLabels();

        this.selectButton = {
            klass: ['btn', 'btn-sm', 'btn-outline-secondary', 'm-0', 'border-0'],
            onClick: (): void => {
                this.showSelectModal();
            },
            icon: 'cursor'
        } as ButtonInterface;

    }

    protected init(): void {

        super.init();

        this.initValue();

        const idFieldName = this.getRelateIdField();
        if (idFieldName && this.record && this.record.fields && this.record.fields[idFieldName]) {
            this.idField = this.record.fields[idFieldName];
        }
    }

    protected initValue(): void {
        if (!this.field.valueObject) {
            this.selectedValue = {};
            this.field.formControl.setValue('');
            return;
        }

        if (!this.field.valueObject.id) {
            this.selectedValue = {};
            this.field.formControl.setValue('');
            return;
        }

        if (this.field?.metadata?.relateSearchField) {
            const rname = this.field?.definition?.rname ?? 'name';
            this.field.valueObject[this.field.metadata.relateSearchField] = this.field.valueObject[rname];
        }

        this.selectedValue = this.field.valueObject;
        this.options = [this.field.valueObject];
    }

    /**
     * Handle newly added item
     *
     * @param {object} item added
     */
    onAdd(item): void {
        if (item) {
            const relateName = this.getRelateFieldName();
            this.setValue(item.id, item[relateName]);
            return;
        }

        this.setValue('', '');
        this.selectedValue = {};

        return;
    }

    /**
     * Handle item removal
     */
    onRemove(): void {
        this.setValue('', '');
        this.selectedValue = {};
        this.options = [];
    }

    onClear(event): void {
        this.selectedValue = {};
        this.filterValue = '';
        this.options = [];
        this.onRemove();
    }

    onFilter(): void {
        const relateName = this.getRelateFieldName();
        this.filterValue = this.filterValue ?? '';
        const matches = this.filterValue.match(/^\s*$/g);
        if (matches && matches.length) {
            this.filterValue = '';
        }
        let term = this.filterValue;
        this.search(term).pipe(
            take(1),
            map(data => data.filter(item => item[relateName] !== '')),
            map(filteredData => filteredData.map(item => ({
                id: item.id,
                [relateName]: item[relateName]
            })))
        ).subscribe(filteredOptions => {
            this.options = filteredOptions;

            if (!this?.selectedValue || !this?.selectedValue?.id) {
                return;
            }

            let found = false;
            filteredOptions.some(value => {
                if (value?.id === this.selectedValue.id) {
                    found = true;
                    return true;
                }

                return false;
            });

            if (found === false && this.selectedValue) {
                this.options.push(this.selectedValue);
            }
        })
    }

    resetFunction(options: DropdownFilterOptions) {
        this.filterValue = '';
        this.options = [];
        if (!emptyObject(this.selectedValue)) {
            this.options = [this.selectedValue];
        }
    }

    onFilterInput(event: KeyboardEvent) {
        event.stopPropagation()
        this.tag.onLazyLoad.emit()
    }

    /**
     * Set value on field
     *
     * @param {string} id to set
     * @param {string} relateValue to set
     */
    protected setValue(id: string, relateValue: string): void {
        const relate = this.buildRelate(id, relateValue);
        this.field.value = relateValue;
        this.field.valueObject = relate;
        this.field.formControl.setValue(relateValue);
        this.field.formControl.markAsDirty();

        if (this.idField) {
            this.idField.value = id;
            this.idField.formControl.setValue(id);
            this.idField.formControl.markAsDirty();
        }

        if (relateValue) {
            const relateName = this.getRelateFieldName();
            this.selectedValue = {id: id, [relateName]: relateValue};
        }

        this.options = [this.selectedValue];
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
        this.tag.writeValue(record.attributes);
        this.onAdd(record.attributes);
    }

    public getTranslatedLabels(): void {
        this.placeholderLabel = this.languages.getAppString('LBL_SELECT_ITEM') || '';
        this.emptyFilterLabel = this.languages.getAppString('ERR_SEARCH_NO_RESULTS') || '';
    }

    focusFilterInput() {
        this.dropdownFilterInput.nativeElement.focus()
    }
}
