import {Injectable} from '@angular/core';
import {StateStore} from '../../../../store/state';
import {ButtonInterface, DropdownButtonInterface, emptyObject, Field, isVoid, SearchMetaFieldMap} from 'common';
import {take, tap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {FilterConfig} from '../../components/list-filter/list-filter.model';
import {MessageService} from '../../../../services/message/message.service';
import {SaveFilterStoreFactory} from '../saved-filter/saved-filter.store.factory';
import {SavedFilterStore} from '../saved-filter/saved-filter.store';
import {SavedFilter} from '../../../../store/saved-filters/saved-filter.model';

@Injectable()
export class ListFilterStore implements StateStore {

    config: FilterConfig;
    panelMode: 'collapsible' | 'closable' | 'none' = 'closable';
    mode = 'filter';

    isCollapsed$: Observable<boolean>;

    closeButton: ButtonInterface;
    myFilterButton: DropdownButtonInterface;

    gridButtons: ButtonInterface[] = null;

    fields: Field[] = [];
    special: Field[] = [];

    vm$: Observable<any>;

    filterStore: SavedFilterStore;
    savedFilters: SavedFilter[] = [];
    displayFields: Field[];

    protected collapse: BehaviorSubject<boolean>;
    protected searchFields: SearchMetaFieldMap;
    protected subs: Subscription[] = [];

    constructor(
        protected message: MessageService,
        protected savedFilterStoreFactory: SaveFilterStoreFactory
    ) {
        this.filterStore = savedFilterStoreFactory.create();
    }


    init(config: FilterConfig): void {
        this.config = config;

        this.initSearchFields();

        this.initConfigUpdatesSubscription();

        this.vm$ = combineLatest([this.filterStore.stagingRecord$]).pipe(
            tap(([savedFilter]) => {
                this.reset();
                this.splitCriteriaFields(savedFilter);
                this.initDisplayFields();
                this.initGridButtons();
                this.initHeaderButtons();
                this.initMyFiltersButton(this.savedFilters);
            })
        );

        if (this.config.panelMode) {
            this.panelMode = this.config.panelMode;
        }

        this.collapse = new BehaviorSubject<boolean>(false);
        this.isCollapsed$ = this.collapse.asObservable();
        if (!isVoid(this.config.isCollapsed)) {
            this.collapse.next(this.config.isCollapsed);
        }

        this.reset();

        this.initGridButtons();
        this.initHeaderButtons();
    }

    clear(): void {
        this.subs.forEach(sub => sub.unsubscribe());
        this.reset();
        this.filterStore.clear();
        this.filterStore = null;
        this.collapse.unsubscribe();
    }

    clearAuthBased(): void {
        this.clear();
    }

    /**
     * Reset criteria
     */
    public reset(): void {
        this.fields = [];
        this.special = [];
    }

    /**
     * Apply current filter values
     */
    public applyFilter(): void {
        this.filterStore.validateCriteria().pipe(take(1)).subscribe(valid => {

            if (valid) {

                if (this.config.panelMode === 'collapsible' && this.config.collapseOnSearch) {
                    this.collapse.next(true);
                }

                this.config.onSearch();
                this.config.updateFilter(this.filterStore.getBaseRecord());
                return;
            }

            this.message.addWarningMessageByKey('LBL_VALIDATION_ERRORS');
        });

    }

    /**
     * Clear the current filter
     */
    public clearFilter(): void {
        this.config.resetFilter(false);
    }

    /**
     * Subscribe to config updates.
     * Each time the filter or metadata changes we need to:
     * - Reset the view state
     * - Re-initialize the filter subscription
     */
    protected initConfigUpdatesSubscription() {
        this.subs.push(
            combineLatest([this.config.filter$, this.config.searchFields$]).pipe(
                tap(([filter, searchFields]) => {
                    this.reset();
                    this.filterStore.initRecord(
                        this.config.module,
                        filter,
                        searchFields,
                        this.config.listFields,
                        'edit'
                    );
                })
            ).subscribe()
        );

        this.subs.push(
            combineLatest([this.config.savedFilters$]).pipe(
                tap(([filters]) => {
                    this.savedFilters = filters;
                    this.initMyFiltersButton(filters);
                })
            ).subscribe()
        );
    }

    /**
     * Split fields per slots
     *
     * @param {object} savedFilter to use
     */
    protected splitCriteriaFields(savedFilter: SavedFilter): void {

        if (!savedFilter || !savedFilter.criteriaFields) {
            return;
        }

        Object.keys(savedFilter.criteriaFields).forEach(key => {
            const field = savedFilter.criteriaFields[key];
            const name = field.name || key;

            if (name.includes('_only')) {
                this.special.push(field);
            } else {
                this.fields.push(field);
            }
        });
    }

    protected initSearchFields(): void {
        this.subs.push(this.config.searchFields$.subscribe(searchFields => {
            this.searchFields = searchFields;
        }));
    }

    protected initDisplayFields(): void {

        if(!this.searchFields || emptyObject(this.searchFields) || !this.fields){
            this.displayFields = [];
        }

        const fields = [];
        this.fields.forEach(field => {
            const name = field.name;
            if(!this.searchFields[name]){
                return;
            }
            fields.push(field);
        });

        this.displayFields = fields;
    }

    /**
     * Initialize grid buttons
     */
    protected initGridButtons(): void {
        this.gridButtons = [
            {
                labelKey: 'LBL_CLEAR_BUTTON_LABEL',
                klass: ['clear-filters-button', 'btn', 'btn-outline-danger', 'btn-sm'],
                onClick: this.clearFilter.bind(this)
            },
            {
                labelKey: 'LBL_SEARCH_BUTTON_LABEL',
                klass: ['filter-button', 'btn', 'btn-danger', 'btn-sm'],
                onClick: this.applyFilter.bind(this)
            }
        ] as ButtonInterface[];
    }

    /**
     * Initialize header buttons
     */
    protected initHeaderButtons(): void {

        this.closeButton = {
            onClick: (): void => {
                this.config.onClose();
            }
        } as ButtonInterface;


    }

    protected initMyFiltersButton(filters: SavedFilter[]): void {

        if(!filters || filters.length < 1){
            this.myFilterButton = null;
            return;
        }

        const button = {
            wrapperKlass: ['filter-select'],
            labelKey: 'LBL_SAVED_FILTER_SHORTCUT',
            klass: ['btn', 'btn-outline-light', 'btn-sm'],
            items: [],
        } as DropdownButtonInterface;

        const currentKey = this.filterStore.getRecordId();

        filters.forEach(filter => {
            const item = {
                label: filter.attributes.name,
                onClick: () => {
                    this.config.setOpenFilter(filter);
                }
            } as ButtonInterface;

            if (filter.key === currentKey) {
                button.label = filter.attributes.name;
                button.labelKey = '';
                item.icon = 'filter';
                item.iconKlass = 'small';
                item.klass = 'active';
            }

            button.items.push(item);
        });

        this.myFilterButton = button;
    }
}
