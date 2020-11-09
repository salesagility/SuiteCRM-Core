import {Component, OnInit} from '@angular/core';
import {HistoryTimelineAdapter} from './history-timeline.adapter.service';
import {BaseWidgetComponent} from '@app-common/containers/widgets/base-widget.model';

@Component({
    selector: 'scrm-history-timeline-widget',
    templateUrl: './history-sidebar-widget.component.html',
    styleUrls: [],
    providers: [HistoryTimelineAdapter]
})
export class HistorySidebarWidgetComponent extends BaseWidgetComponent implements OnInit {

    constructor(public adapter: HistoryTimelineAdapter) {
        super();
    }

    ngOnInit(): void {
    }

}
