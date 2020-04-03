import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WidgetService {

    displayWidgets = true;
    widgetHeaderToggleIcon = 'public/themes/suite8/images/minimise_circled.svg';
    listViewFullWidth = true;

    constructor() {
    }

    emitData() {
        this.displayWidgets = !this.displayWidgets;
        this.listViewFullWidth = !this.listViewFullWidth;
    }
}
