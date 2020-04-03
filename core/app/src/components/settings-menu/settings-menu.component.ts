import {Component, OnInit} from '@angular/core';
import {WidgetService} from '../widget/widget.service';

@Component({
    selector: 'scrm-settings-menu-ui',
    templateUrl: 'settings-menu.component.html',

})

export class SettingsmenuUiComponent implements OnInit {

    constructor(private widgetService: WidgetService) {
    }

    toggleWidgets(): void {
        this.widgetService.emitData();
    }


    ngOnInit(): void {

    }

}
