import {Component, OnInit} from '@angular/core';
import {HistoryTimelineAdapter} from './history-timeline.adapter.service';
import {BaseWidgetComponent} from '@app-common/containers/widgets/base-widget.model';
import {LanguageStore} from '@store/language/language.store';

@Component({
    selector: 'scrm-history-timeline-widget',
    templateUrl: './history-sidebar-widget.component.html',
    styleUrls: [],
    providers: [HistoryTimelineAdapter]
})
export class HistorySidebarWidgetComponent extends BaseWidgetComponent implements OnInit {

    constructor(public adapter: HistoryTimelineAdapter, public languageStore: LanguageStore) {
        super();
    }

    ngOnInit(): void {
    }

    getHeaderLabel(): string {
        return this.languageStore.getFieldLabel('LBL_QUICK_HISTORY');
    }

}
