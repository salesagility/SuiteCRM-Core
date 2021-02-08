import {Component, Input, OnInit} from '@angular/core';
import {map, take} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStringMap, LanguageStrings} from '@store/language/language.store';
import {SubpanelContainerConfig} from '@containers/subpanel/components/subpanel-container/subpanel-container.model';
import {SubpanelStore, SubpanelStoreMap} from '@containers/subpanel/store/subpanel/subpanel.store';
import {MaxColumnsCalculator} from '@services/ui/max-columns-calculator/max-columns-calculator.service';
import {ViewContext} from '@app-common/views/view.model';
import {WidgetMetadata} from '@app-common/metadata/widget.metadata';
import {GridWidgetInput, StatisticsQueryArgs} from '@components/grid-widget/grid-widget.component';

interface SubpanelContainerViewModel {
    appStrings: LanguageStringMap;
    subpanels: SubpanelStoreMap;
}

@Component({
    selector: 'scrm-subpanel-container',
    templateUrl: 'subpanel-container.component.html',
    providers: [MaxColumnsCalculator]
})
export class SubpanelContainerComponent implements OnInit {

    @Input() config: SubpanelContainerConfig;

    isCollapsed = false;
    toggleIcon = 'arrow_down_filled';
    maxColumns$: Observable<number>;

    languages$: Observable<LanguageStrings> = this.languageStore.vm$;

    vm$: Observable<SubpanelContainerViewModel>;

    constructor(
        protected languageStore: LanguageStore,
        protected maxColumnCalculator: MaxColumnsCalculator
    ) {
    }

    ngOnInit(): void {
        this.vm$ = combineLatest([this.languages$, this.config.subpanels$]).pipe(
            map(([languages, subpanels]) => ({
                appStrings: languages.appStrings || {},
                subpanels,
            })),
        );

        this.maxColumns$ = this.getMaxColumns();
    }

    getMaxColumns(): Observable<number> {
        return this.maxColumnCalculator.getMaxColumns(this.config.sidebarActive$);
    }

    toggleSubPanels(): void {
        this.isCollapsed = !this.isCollapsed;
        this.toggleIcon = (this.isCollapsed) ? 'arrow_up_filled' : 'arrow_down_filled';
    }

    showSubpanel(item: SubpanelStore): void {
        item.show = !item.show;
        if (item.show) {
            item.load().pipe(take(1)).subscribe();
        }
    }

    getGridConfig(vm: SubpanelStore): GridWidgetInput {

        if (!vm.metadata || !vm.metadata.insightWidget) {
            return {
                layout: null,
            } as GridWidgetInput;
        }

        return {
            rowClass: 'statistics-sidebar-widget-row',
            columnClass: 'statistics-sidebar-widget-col',
            layout: vm.metadata.insightWidget.options.insightWidget,
            widgetConfig: {reload$: this.config.sidebarActive$} as WidgetMetadata,
            queryArgs: {
                module: vm.metadata.name,
                context: {module: vm.parentModule, id: vm.parentId} as ViewContext,
                params: {subpanel: vm.metadata.name},
            } as StatisticsQueryArgs,
        } as GridWidgetInput;
    }
}
