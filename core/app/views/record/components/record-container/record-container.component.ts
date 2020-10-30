import {Component, OnInit} from '@angular/core';
import {RecordViewStore} from '@views/record/store/record-view/record-view.store';
import {MetadataStore, RecordViewMetadata} from '@store/metadata/metadata.store.service';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStrings} from '@store/language/language.store';
import {map} from 'rxjs/operators';
import {RecordContentAdapter} from '@views/record/adapters/record-content.adapter';
import {RecordContentDataSource} from '@components/record-content/record-content.model';
import {SubpanelContainerConfig} from '@containers/subpanel/components/subpanel-container/subpanel-container.model';
import {ViewContext} from '@app-common/views/view.model';
import {TopWidgetAdapter} from '@views/record/adapters/top-widget.adapter';

@Component({
    selector: 'scrm-record-container',
    templateUrl: 'record-container.component.html',
    providers: [RecordContentAdapter, TopWidgetAdapter]
})
export class RecordContainerComponent implements OnInit {
    type = '';
    widgetTitle = '';

    language$: Observable<LanguageStrings> = this.language.vm$;

    vm$ = combineLatest([
        this.language$, this.recordViewStore.showWidgets$, this.topWidgetAdapter.config$
    ]).pipe(
        map((
            [language, showWidgets, topWidgetConfig]
        ) => ({
            language,
            showWidgets,
            topWidgetConfig
        }))
    );

    constructor(
        public recordViewStore: RecordViewStore,
        protected language: LanguageStore,
        protected metadata: MetadataStore,
        protected contentAdapter: RecordContentAdapter,
        protected topWidgetAdapter: TopWidgetAdapter
    ) {
    }

    ngOnInit(): void {
    }

    getDisplayWidgets(): boolean {
        const display = this.recordViewStore.showWidgets;
        if (display) {
            this.type = 'history';
            this.widgetTitle = 'LBL_QUICK_HISTORY';
        }
        return display;
    }

    getContentAdapter(): RecordContentDataSource {
        return this.contentAdapter;
    }

    getSubpanelsConfig(): SubpanelContainerConfig {
        return {
            subpanels$: this.recordViewStore.subpanels$,
            sidebarActive$: this.recordViewStore.widgets$
        } as SubpanelContainerConfig;
    }

    getViewContext(): ViewContext {
        return this.recordViewStore.getViewContext();
    }

    hasTopWidgetMetadata(meta: RecordViewMetadata): boolean {
        return !!(meta && meta.topWidget && meta.topWidget.type);
    }
}
