import {Component, OnInit} from '@angular/core';
import {ListViewStore} from '@store/list-view/list-view.store';
import {ButtonInterface} from '@components/button/button.model';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';
import {ButtonGroupInterface} from '@components/button-group/button-group.model';
import {ColumnChooserComponent} from '@components/columnchooser/columnchooser.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {ScreenSize, ScreenSizeObserverService} from '@services/ui/screen-size-observer/screen-size-observer.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {SearchCriteriaFilter} from '@app-common/views/list/search-criteria.model';

@Component({
    selector: 'scrm-settings-menu',
    templateUrl: 'settings-menu.component.html',

})
export class SettingsMenuComponent implements OnInit {

    configState = new BehaviorSubject<ButtonGroupInterface>({buttons: []});
    config$ = this.configState.asObservable();

    vm$ = combineLatest([
        this.listStore.widgets$,
        this.listStore.displayFilters$,
        this.listStore.criteria$,
        this.screenSize.screenSize$
    ]).pipe(
        map(([widgets, displayFilters, criteria, screenSize]) => {
            if (screenSize) {
                this.screen = screenSize;
            }
            this.configState.next(this.getButtonGroupConfig());
            return {widgets, displayFilters, criteria, screenSize};
        })
    );

    protected screen: ScreenSize = ScreenSize.Medium;
    protected defaultBreakpoint = 5;
    protected breakpoint: number;

    constructor(
        protected listStore: ListViewStore,
        protected modalService: NgbModal,
        protected screenSize: ScreenSizeObserverService,
        protected systemConfigStore: SystemConfigStore
    ) {
    }

    ngOnInit(): void {
        this.configState.next(this.getButtonGroupConfig());
    }

    getButtonGroupConfig(): ButtonGroupInterface {
        const availableButtons = [
            {button: this.getDisplayAsButton()},
            {
                show: (): boolean => this.listStore.getFilter() && this.listStore.getFilter().length >= 1,
                button: this.getMyFiltersButton(),
            },
            {button: this.getFilterButton()},
            {
                show: (): boolean => !Object.keys(this.getFilters()).every(key => this.getFilters()[key].operator === ''),
                button: this.getClearButton(),
            },
            {button: this.getColumnChooserButton()},
            {
                show: (): boolean => this.listStore.getChartTypes() && !!Object.keys(this.listStore.getChartTypes()).length,
                button: this.getChartsButton(),
            },
        ];

        const config = {
            buttonKlass: ['settings-button'],
            dropdownLabel: this.listStore.appStrings.LBL_OPTIONS || '',
            breakpoint: this.getBreakpoint(),
            dropdownOptions: {
                placement: ['bottom-right'],
                wrapperKlass: ['dropdown-button-secondary']
            },
            buttons: []
        } as ButtonGroupInterface;

        availableButtons.forEach(availableButton => {
            if (!availableButton.show) {
                config.buttons.push(availableButton.button);
                return;
            }

            if (availableButton.show()) {
                config.buttons.push(availableButton.button);
            }
        });

        return config;
    }

    getFilters(): SearchCriteriaFilter {
        return this.listStore.recordList.criteria.filters;
    }

    getBreakpoint(): number {

        const breakpointMap = this.systemConfigStore.getConfigValue('listview_settings_limits');

        if (this.screen && breakpointMap && breakpointMap[this.screen]) {
            this.breakpoint = breakpointMap[this.screen];
            return this.breakpoint;
        }

        if (this.breakpoint) {
            return this.breakpoint;
        }

        return this.defaultBreakpoint;
    }


    getFilterButton(): DropdownButtonInterface {

        return {
            label: this.listStore.appStrings.LBL_FILTER || '',
            klass: {
                'filter-settings-button': true,
                active: this.listStore.showFilters
            },
            icon: 'filter',
            onClick: (): void => {
                this.listStore.showFilters = !this.listStore.showFilters;
            }
        } as ButtonInterface;
    }

    getMyFiltersButton(): DropdownButtonInterface {
        const filters = this.listStore.getFilter() || [];

        const dropdownConfig = {
            label: this.listStore.appStrings.LBL_SAVED_FILTER_SHORTCUT || '',
            klass: ['dropdown-toggle'],
            wrapperKlass: ['filter-action-group'],
            items: []
        } as DropdownButtonInterface;


        filters.forEach((filter: any) => {
            dropdownConfig.items.push({
                label: filter.name,
                onClick: (): void => {
                    const parsedFilter: any = [];
                    Object.keys(filter.filters).forEach(key => {
                        parsedFilter.push({
                            field: key,
                            operator: '=',
                            values: [filter.filters[key]],
                        });
                    });

                    const newItem = {
                        filter
                    };
                    parsedFilter.map(item => {
                        newItem.filter.filters[item.field] = parsedFilter[0];
                    });

                    this.listStore.updateSearchCriteria({filters: newItem.filter.filters});
                }
            });
        });

        return dropdownConfig;
    }

    getClearButton(): ButtonInterface {
        return {
            label: this.listStore.appStrings.LBL_CLEAR_BUTTON_LABEL || '',
            icon: 'filter',
            onClick: (): void => {
                this.listStore.updateSearchCriteria({filters: {}}, true);
            }
        };
    }

    getChartsButton(): ButtonInterface {

        return {
            label: this.listStore.appStrings.LBL_CHARTS || '',
            klass: {
                active: this.listStore.showWidgets
            },
            icon: 'pie',
            onClick: (): void => {
                this.listStore.showWidgets = !this.listStore.showWidgets;
            }
        };
    }

    getDisplayAsButton(): DropdownButtonInterface {

        return {
            label: 'Display As',
            klass: {},
            items: []
        };
    }

    getColumnChooserButton(): ButtonInterface {

        return {
            label: this.listStore.appStrings.LBL_COLUMNS || '',
            klass: {
                'column-chooser-button': true,
            },
            icon: 'column_chooser',
            onClick: (): void => {
                this.modalService.open(ColumnChooserComponent, {
                    ariaLabelledBy: 'modal-basic-title',
                    centered: true,
                    size: 'lg',
                    windowClass: 'column-chooser-modal'
                });
            }
        };
    }
}
