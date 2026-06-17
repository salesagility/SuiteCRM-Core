/**
 * SuiteCRM is a customer relationship management program developed by SuiteCRM Ltd.
 * Copyright (C) 2026 SuiteCRM Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUITECRM, SUITECRM DISCLAIMS THE
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

import {Component, Input, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {animate, transition, trigger} from '@angular/animations';
import {Observable, of, Subscription} from 'rxjs';
import {ButtonInterface} from '../../../common/components/button/button.model';
import {
    AnyModalButtonInterface,
    ModalButtonGroupInterface,
    ModalCloseFeedBack
} from '../../../common/components/modal/modal.model';
import {FieldMap} from '../../../common/record/field.model';
import {StringMap} from '../../../common/types/string-map';
import {TableConfig} from '../../../components/table/table.model';
import {RecordListModalStore} from '../../record-list-modal/store/record-list-modal/record-list-modal.store';
import {
    RecordListModalStoreFactory
} from '../../record-list-modal/store/record-list-modal/record-list-modal.store.factory';
import {MaxColumnsCalculator} from '../../../services/ui/max-columns-calculator/max-columns-calculator.service';
import {ModuleNavigation} from '../../../services/navigation/module-navigation/module-navigation.service';
import {FilterConfig} from '../../list-filter/components/list-filter/list-filter.model';
import {SavedFilter} from '../../../store/saved-filters/saved-filter.model';
import {UserPreferenceStore} from '../../../store/user-preference/user-preference.store';
import {SystemConfigStore} from '../../../store/system-config/system-config.store';
import {ConfirmationListAction, ConfirmationListFieldConfig} from '../models/confirmation-list-modal.model';
import {ConfirmationListTableAdapter} from '../adapters/table.adapter';
import {ConfirmationListFilterAdapter} from '../adapters/filter.adapter';
import {ConfirmationListActionsAdapter} from '../actions/confirmation-list-actions.adapter';

@Component({
    selector: 'scrm-confirmation-list-modal',
    templateUrl: './confirmation-list-modal.component.html',
    styleUrls: [],
    providers: [MaxColumnsCalculator, ConfirmationListActionsAdapter],
    animations: [
        trigger('modalFade', [
            transition('void <=> *', [
                animate('800ms')
            ]),
        ]),
    ]
})
export class ConfirmationListModalComponent implements OnInit, OnDestroy {

    @Input() titleKey: string = '';
    @Input() messageKey: string = '';
    @Input() module: string = '';
    @Input() presetFilter: SavedFilter = {} as SavedFilter;
    @Input() showFilter: boolean = false;
    @Input() columnFields: ConfirmationListFieldConfig[] = [];
    @Input() buttons: AnyModalButtonInterface[] = [];
    @Input() actions: ConfirmationListAction[] = [];
    @Input() onProceed: Function = () => {
    };
    @Input() onClose: Function = () => {
    };
    @Input() fields: FieldMap = {};
    @Input() context: StringMap = {};

    loading$: Observable<boolean>;
    tableConfig: TableConfig;
    filterConfig: FilterConfig;
    buttonGroup$: Observable<ModalButtonGroupInterface>;
    closeButton: ButtonInterface;

    showFilterSignal: WritableSignal<boolean> = signal(false);

    protected store: RecordListModalStore;
    protected subs: Subscription[] = [];

    constructor(
        public activeModal: NgbActiveModal,
        protected storeFactory: RecordListModalStoreFactory,
        protected maxColumnCalculator: MaxColumnsCalculator,
        protected navigation: ModuleNavigation,
        protected preferences: UserPreferenceStore,
        protected systemConfigs: SystemConfigStore,
        protected actionsAdapter: ConfirmationListActionsAdapter
    ) {
        this.store = this.storeFactory.create();
    }

    ngOnInit(): void {
        this.closeButton = {
            klass: ['btn', 'btn-outline-light', 'btn-sm'],
            onClick: (): void => {
                this.onClose();
                this.activeModal.close({
                    type: 'close-button'
                } as ModalCloseFeedBack);
            }
        } as ButtonInterface;

        this.showFilterSignal.set(this.showFilter);

        this.initStore();
        this.initTable();
        this.initFilter();
        this.buildActionButtons();
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
        this.store.clear();
    }

    protected initStore(): void {
        this.store.init(this.module, '', this.presetFilter);
        this.loading$ = this.store.metadataLoading$;
    }

    protected initTable(): void {
        const adapter = new ConfirmationListTableAdapter(
            this.navigation,
            this.systemConfigs,
            this.preferences,
            this.columnFields
        );
        this.tableConfig = adapter.getTable(this.store);
        this.tableConfig.maxColumns$ = this.maxColumnCalculator.getMaxColumns(of(true));
    }

    protected initFilter(): void {
        const adapter = new ConfirmationListFilterAdapter();
        this.filterConfig = adapter.getConfig(this.store);
    }

    protected buildActionButtons(): void {
        if (this.actions?.length > 0) {
            this.actionsAdapter.init({
                module: this.module,
                store: this.store,
                activeModal: this.activeModal,
                onProceed: this.onProceed,
                onClose: this.onClose,
                actions: this.actions
            });
            this.buttonGroup$ = this.actionsAdapter.buildButtonGroup();
            return;
        }

        this.buttonGroup$ = of({
            buttons: [...this.buttons]
        } as ModalButtonGroupInterface);
    }
}
