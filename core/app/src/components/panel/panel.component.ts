import {Component, Input, OnInit} from '@angular/core';
import {Button, ButtonInterface} from '@components/button/button.model';

@Component({
    selector: 'scrm-panel',
    templateUrl: './panel.component.html',
    styleUrls: []
})
export class PanelComponent implements OnInit {

    @Input() title: string;
    @Input() close: ButtonInterface = {
        klass: ['btn', 'btn-outline-light', 'btn-sm']
    } as ButtonInterface;

    protected buttonClasses = ['btn', 'btn-outline-light', 'btn-sm'];

    constructor() {
    }

    ngOnInit(): void {
        this.initCloseButton();
    }

    initCloseButton(): void {
        if (!this.close) {
            return;
        }

        const btn = Button.fromButton(this.close);
        btn.addClasses(this.buttonClasses);

        this.close = btn;
    }
}
