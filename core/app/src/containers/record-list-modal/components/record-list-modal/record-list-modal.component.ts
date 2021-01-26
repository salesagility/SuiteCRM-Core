import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {animate, transition, trigger} from '@angular/animations';
import {ModalCloseFeedBack} from '@app-common/components/modal/modal.model';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {ModalRecordListTableAdapter} from '@containers/record-list-modal/adapters/table.adapter';
import {LanguageStore} from '@store/language/language.store';
import {Observable, of, Subscription} from 'rxjs';
import {TableConfig} from '@components/table/table.model';
import {RecordListModalStore} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store';
import {MaxColumnsCalculator} from '@services/ui/max-columns-calculator/max-columns-calculator.service';
import {RecordListModalStoreFactory} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store.factory';
import {RecordListModalTableAdapterInterface} from '@containers/record-list-modal/adapters/adapter.model';
import {distinctUntilChanged, skip} from 'rxjs/operators';
import {RecordListModalResult} from '@containers/record-list-modal/components/record-list-modal/record-list-modal.model';
import {FilterConfig} from '@components/list-filter/list-filter.model';
import {ModalRecordFilterAdapter} from '@containers/record-list-modal/adapters/filter.adapter';

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
