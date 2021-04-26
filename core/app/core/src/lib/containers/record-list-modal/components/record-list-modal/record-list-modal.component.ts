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

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {animate, transition, trigger} from '@angular/animations';
import {ButtonInterface, ModalCloseFeedBack} from 'common';
import {Observable, of, Subscription} from 'rxjs';
import {distinctUntilChanged, skip} from 'rxjs/operators';
import {ModalRecordFilterAdapter} from '../../adapters/filter.adapter';
import {ModalRecordListTableAdapter} from '../../adapters/table.adapter';
import {RecordListModalTableAdapterInterface} from '../../adapters/adapter.model';
import {RecordListModalStore} from '../../store/record-list-modal/record-list-modal.store';
import {RecordListModalStoreFactory} from '../../store/record-list-modal/record-list-modal.store.factory';
import {TableConfig} from '../../../../components/table/table.model';
import {MaxColumnsCalculator} from '../../../../services/ui/max-columns-calculator/max-columns-calculator.service';
import {FilterConfig} from '../../../list-filter/components/list-filter/list-filter.model';
import {LanguageStore} from '../../../../store/language/language.store';
import {RecordListModalResult} from './record-list-modal.model';

@Component({
    selector: 'scrm-record-list-modal',
    templateUrl: './record-list-modal.component.html',
    styleUrls: [],
    providers: [MaxColumnsCalculator],
    animations: [
        trigger('modalFade', [
            transition('void <=> *', [
                animate('800ms')
            ]),
        ]),
    ]
})
export class RecordListModalComponent implements OnInit, OnDestroy {

    @Input() titleKey = '';
    @Input() module: string;
    @Input() adapter: RecordListModalTableAdapterInterface = null;
    @Input() filterAdapter: ModalRecordFilterAdapter = null;

    loading$: Observable<boolean>;

    closeButton: ButtonInterface;
    tableConfig: TableConfig;
    filterConfig: FilterConfig;
    store: RecordListModalStore;

    protected subs: Subscription[] = [];

    constructor(
        public activeModal: NgbActiveModal,
        protected storeFactory: RecordListModalStoreFactory,
        protected languages: LanguageStore,
        protected maxColumnCalculator: MaxColumnsCalculator
    ) {
        this.store = this.storeFactory.create();
    }

    ngOnInit(): void {

        this.closeButton = {
            klass: ['btn', 'btn-outline-light', 'btn-sm'],
            onClick: (): void => {
                this.activeModal.close({
                    type: 'close-button'
                } as ModalCloseFeedBack);
            }
        } as ButtonInterface;

        this.init();
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    init(): void {
        if (!this.module) {
            return;
        }
        this.initStore();
        this.initTableAdapter();
        this.initFilterAdapters();
    }

    getMaxColumns(): Observable<number> {
        return this.maxColumnCalculator.getMaxColumns(of(true));
    }

    protected initTableAdapter(): void {
        if (this.adapter === null) {
            this.adapter = new ModalRecordListTableAdapter();
        }

        this.tableConfig = this.adapter.getTable(this.store);
        this.tableConfig.maxColumns$ = this.getMaxColumns();
    }

    protected initFilterAdapters(): void {
        if (this.filterAdapter === null) {
            this.filterAdapter = new ModalRecordFilterAdapter();
        }

        this.filterConfig = this.filterAdapter.getConfig(this.store);
    }

    protected initStore(): void {
        this.store.init(this.module);
        this.loading$ = this.store.metadataLoading$;

        this.subs.push(this.store.recordList.selection$.pipe(distinctUntilChanged(), skip(1)).subscribe(selection => {

            if (!selection || !selection.selected || Object.keys(selection.selected).length < 1) {
                return;
            }

            this.activeModal.close({
                selection,
                records: this.store.recordList.records
            } as RecordListModalResult);
        }));
    }
}
