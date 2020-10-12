import {Component, OnInit} from '@angular/core';
import {HistoryTimelineAdapter} from './history-timeline.adapter.service';

@Component({
    selector: 'scrm-history-timeline-widget',
    templateUrl: './history-timeline-widget.component.html',
    styleUrls: [],
    providers: [HistoryTimelineAdapter]
})
export class HistoryTimelineWidgetComponent implements OnInit {

    constructor(public adapter: HistoryTimelineAdapter) {
    }

    ngOnInit(): void {
    }

}
