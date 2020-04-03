import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'scrm-widget-ui',
    templateUrl: 'widget.component.html',
    animations: [
        trigger('widgetFade', [
            transition('void => *', [
                style({transform: 'translateX(100%)', opacity: 0}),
                animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
            ]),
            transition('* => void', [
                style({transform: 'translateX(0)', opacity: 1}),
                animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
            ])
        ]),
        trigger('widgetContentFade', [
            transition('void => *', [
                style({transform: 'translateY(-5%)', opacity: 0}),
                animate('500ms', style({transform: 'translateY(0)', opacity: 1}))
            ]),
            transition('* => void', [
                style({transform: 'translateY(0)', opacity: 1}),
                animate('500ms', style({transform: 'translateY(-5%)', opacity: 0}))
            ])
        ])
    ]
})

export class WidgetUiComponent implements OnInit {


    displayWidgetContent = true;
    widgetHeaderToggleIcon = 'minimise_circled';

    toggleWidgetContent() {
        if (this.widgetHeaderToggleIcon === 'minimise_circled') {
            this.widgetHeaderToggleIcon = 'plus_thin';
            this.displayWidgetContent = false;
        } else {
            this.widgetHeaderToggleIcon = 'minimise_circled';
            this.displayWidgetContent = true;
        }
    }

    ngOnInit() {

    }
}
