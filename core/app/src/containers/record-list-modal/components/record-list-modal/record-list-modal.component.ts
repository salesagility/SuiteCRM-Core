import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {animate, transition, trigger} from '@angular/animations';
import {ModalCloseFeedBack} from '@app-common/components/modal/modal.model';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {ModalRecordListTableAdapter} from '@containers/record-list-modal/adapters/table.adapter';
import {LanguageStore} from '@store/language/language.store';
import {Observable, of} from 'rxjs';
import {TableConfig} from '@components/table/table.model';
import {RecordListModalStore} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store';
import {MaxColumnsCalculator} from '@services/ui/max-columns-calculator/max-columns-calculator.service';
import {RecordListModalStoreFactory} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store.factory';

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
export class RecordListModalComponent implements OnInit {

    @Input() titleKey = '';
    @Input() module: string;

    loading$: Observable<boolean>;

    closeButton: ButtonInterface;

    adapter: ModalRecordListTableAdapter;
    tableConfig: TableConfig;
    protected store: RecordListModalStore;

    constructor(
        public activeModal: NgbActiveModal,
        protected storeFactory: RecordListModalStoreFactory,
        protected languages: LanguageStore,
        protected maxColumnCalculator: MaxColumnsCalculator
    ) {
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

    init(): void {
        if (!this.module) {
            return;
        }
        this.initStore();
        this.initTableAdapter();
    }

    getMaxColumns(): Observable<number> {
        return this.maxColumnCalculator.getMaxColumns(of(true));
    }

    protected initTableAdapter(): void {
        this.adapter = new ModalRecordListTableAdapter(this.store);
        this.tableConfig = this.adapter.getTable();
        this.tableConfig.maxColumns$ = this.getMaxColumns();
    }

    protected initStore(): void {
        this.store = this.storeFactory.create();
        this.store.init(this.module);
        this.loading$ = this.store.metadataLoading$;
    }
}
