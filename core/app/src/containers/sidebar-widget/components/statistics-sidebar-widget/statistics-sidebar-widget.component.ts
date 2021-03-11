import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseWidgetComponent} from '@app-common/containers/widgets/base-widget.model';
import {ViewContext} from '@app-common/views/view.model';
import {Subscription} from 'rxjs';
import {LanguageStore} from '@store/language/language.store';
import {StatisticWidgetOptions, WidgetMetadata} from '@app-common/metadata/widget.metadata';
import {GridWidgetConfig, StatisticsQueryArgs} from '@components/grid-widget/grid-widget.component';

@Component({
    selector: 'scrm-statistics-sidebar-widget',
    templateUrl: './statistics-sidebar-widget.component.html',
    styles: []
})
export class StatisticsSidebarWidgetComponent extends BaseWidgetComponent implements OnInit, OnDestroy {


    options: StatisticWidgetOptions;

    protected subs: Subscription[] = [];

    constructor(protected language: LanguageStore
    ) {
        super();
    }

    ngOnInit(): void {

        const options = this.config.options || {};
        this.options = options.sidebarStatistic || null;

        if (this.context$) {
            this.subs.push(this.context$.subscribe((context: ViewContext) => {
                this.context = context;
            }));
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    getHeaderLabel(): string {
        return this.getLabel(this.config.labelKey) || '';
    }

    getLabel(key: string): string {
        const context = this.context || {} as ViewContext;
        const module = context.module || '';

        return this.language.getFieldLabel(key, module);
    }

    getGridConfig(): GridWidgetConfig {
        return {
            rowClass: 'statistics-sidebar-widget-row',
            columnClass: 'statistics-sidebar-widget-col',
            layout: this.options,
            widgetConfig: {reload$: this.config.reload$} as WidgetMetadata,
            queryArgs: {
                module: this.context.module,
                context: this.context,
                params: {},
            } as StatisticsQueryArgs,
        } as GridWidgetConfig;
    }

}
