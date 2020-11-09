import {Component, Input, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {LanguageStore} from '@store/language/language.store';

@Component({
    selector: 'scrm-widget-panel',
    templateUrl: 'widget-panel.component.html',
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

export class WidgetPanelComponent implements OnInit {
    @Input() title;

    displayContent = true;

    constructor(public languageStore: LanguageStore) {
    }

    ngOnInit(): void {
        this.title = this.languageStore.getAppString(this.title);
    }
}
