import {Component, Input, OnInit} from '@angular/core';
import {WidgetService} from '../widget/widget.service';

@Component({
    selector: 'scrm-list-container-ui',
    templateUrl: 'list-container.component.html'

})

export class ListcontainerUiComponent implements OnInit {
    @Input() module;

    constructor(public widgetService: WidgetService) {
    }

    toggleWidgets(): void {
        this.widgetService.emitData();
    }

    ngOnInit(): void {
    }
}
