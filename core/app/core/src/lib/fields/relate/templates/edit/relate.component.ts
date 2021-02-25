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
import {ButtonInterface, Record} from 'common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModuleNameMapper} from '../../../../services/navigation/module-name-mapper/module-name-mapper.service';
import {DataTypeFormatter} from '../../../../services/formatters/data-type.formatter.service';
import {RecordListModalComponent} from '../../../../containers/record-list-modal/components/record-list-modal/record-list-modal.component';
import {BaseRelateComponent} from '../../../base/base-relate.component';
import {LanguageStore} from '../../../../store/language/language.store';
import {RelateService} from '../../../../services/record/relate/relate.service';
import {RecordListModalResult} from '../../../../containers/record-list-modal/components/record-list-modal/record-list-modal.model';

@Component({
    selector: 'scrm-relate-edit',
    templateUrl: './relate.component.html',
    styleUrls: [],
    providers: [RelateService]
})
export class RelateEditFieldComponent extends BaseRelateComponent {
    @ViewChild('tag') tag: TagInputComponent;
    selectButton: ButtonInterface;

    /**
     * Constructor
     *
     * @param {object} languages service
     * @param {object} typeFormatter service
     * @param {object} relateService service
     * @param {object} moduleNameMapper service
     * @param {object} modalService service
     */
    constructor(
        protected languages: LanguageStore,
        protected typeFormatter: DataTypeFormatter,
        protected relateService: RelateService,
        protected moduleNameMapper: ModuleNameMapper,
        protected modalService: NgbModal
    ) {
        super(languages, typeFormatter, relateService, moduleNameMapper);

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
        super.ngOnInit();
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
        this.selectedValues = [];

        return;
    }

    /**
     * Handle item removal
     */
    onRemove(): void {
        this.setValue('', '');
        this.selectedValues = [];

        setTimeout(() => {
            this.tag.focus(true, true);
        }, 200);
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
        this.tag.writeValue([record.attributes]);
        this.onAdd(record.attributes);
    }
}
