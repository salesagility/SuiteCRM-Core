import {Component, Input, OnInit} from '@angular/core';
import {Button, ButtonInterface} from '@app-common/components/button/button.model';

@Component({
    selector: 'scrm-close-button',
    templateUrl: './close-button.component.html',
    styleUrls: []
})
export class CloseButtonComponent implements OnInit {
    @Input() config: ButtonInterface;

    buttonClasses = ['close-button'];

    constructor() {
    }

    ngOnInit(): void {
        const btn = Button.fromButton(this.config);
        btn.addClasses(this.buttonClasses);
        this.config = btn;
    }
}
